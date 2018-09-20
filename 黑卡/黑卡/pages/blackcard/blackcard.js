// pages/blackcard/blackcard.js
let that;
const util = require("../../utils/util.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip:"",
    maskhidden:true,
    SWuserInfo:{},
    WXuserInfo:null,
    jsoninfo:null,
    blackcard:{},
    codeimage:'',
    VIPnumber:''
  },
  getCard:function(e){
    app.getACCESS_TOKEN(function(res){
      let ticket;
      if (res.errcode == 0) {
        ticket = res.ticket;
      } else {
        app.showModel("提示", "领取卡券出错，api_ticket有误");
        return;
      }
      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;  
      let nonce_str=Math.random().toString(36).substr(2);
      let openId = app.globalData.SWuserInfo.userIdWX;
      let card_id = app.card_id;
      let qmarry=[];
      qmarry.push(ticket, timestamp, nonce_str, openId, card_id);
      qmarry.sort();
      let signaturestring="";
      qmarry.forEach(function(item){
        signaturestring = signaturestring+item;
      })
      let signature = util.sha1(signaturestring);
      let cardExt = { openid: openId, timestamp: timestamp, signature: signature, nonce_str: nonce_str};
      wx.addCard({
        cardList: [
          {
            cardId: card_id,
            cardExt: JSON.stringify(cardExt)
          }
        ],
        success: function (res) {
          console.log(res.cardList) // 卡券添加结果
        },
        fail:function(res){
          console.info(res);
        }
      })
    })
  },
  showCard:function(e){
    // that.setData({
    //   maskhidden: false,
    // })
    wx.switchTab({
      url: '/pages/shoplist/shoplist',
    })
  },
  //微信支付
  wxpay: function (data) {
    console.info(data)
    wx.requestPayment({
      'timeStamp': data.time,
      'nonceStr': data.nonceStr,
      'package': 'prepay_id=' + data.prepay_id,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        app.showModel("提示", "支付成功可能有延迟，可以多下拉刷新尝试！！", function (res) {
          app.getUserInfo(that.getSWuserInfo());
        })
      },
      'fail': function (res) {
        console.info(res);

      },

    })
  },
  hiddenmask:function(e){
    that.setData({
      maskhidden:true
    })
  },
  buyCard:function(e){
    app.post("user/payvip", {userId:app.globalData.userId},function(res){
      that.wxpay(res.body);
    })
  },
  getblackcardinfo:function(e){
    app.post("shop/findimageandtext",{
      appid:app.sunwouId,
      type:'black'
    },function(res){
      if(res.code==1000&&res.body!=undefined&&res.body.length>0){
        let jsoninfo = JSON.parse(res.body[0].path)
        that.setData({
          jsoninfo: jsoninfo,
          blackcard: res.body[0]
        })
      }
    })
  },
  getcodeimage:function(e){
    app.post("user/barcode", { 
      content: JSON.stringify({ sunwouId: app.globalData.SWuserInfo.sunwouId, type:"blackcard"}) , 
      appid: app.sunwouId 
      }, function (res) {
      if (res.code == 1000) {
        res.body=res.body.replace(/\n/g, '');
        that.setData({
          codeimage: res.body
        })
      }
    });
  },
  getuserinfo:function(e){
    let WXuserInfo=wx.getStorageSync("WXuserInfo");
    console.info(WXuserInfo)
    if (WXuserInfo != null && WXuserInfo != undefined && WXuserInfo != {} && WXuserInfo!=''){
      that.setData({
        WXuserInfo: WXuserInfo
      })
    }else{
      wx.getUserInfo({
        success: function (res) {
          wx.setStorageSync('WXuserInfo', res.userInfo)
          that.setData({
            WXuserInfo: res.userInfo,
          })
        },
        fail(res) {
          app.showModel("提示", "请先授权获取用户信息！！", function (res) {
            wx.openSetting({
              success: (res) => {
                wx.getUserInfo({
                  success: function (res) {
                    wx.setStorageSync('WXuserInfo', res.userInfo)
                    that.setData({
                      WXuserInfo: res.userInfo,
                    })
                  }
                })
              }
            })
          })
        }
      })
    }
  },
  getSWuserInfo(){
    let SWuserInfo;
    SWuserInfo = wx.getStorageSync('SWuserInfo');
    if (SWuserInfo == undefined || SWuserInfo == null || SWuserInfo==''){
      SWuserInfo = app.globalData.SWuserInfo;
      if (SWuserInfo == undefined || SWuserInfo == null) {
        setTimeout(function (e) {
          that.getSWuserInfo();
        }, 500)
      } else {
        wx.stopPullDownRefresh()
        that.setData({
          SWuserInfo: SWuserInfo
        })
        let VIPnumber;
        if ( SWuserInfo.payLog != undefined && SWuserInfo.payLog.length > 0) {
          // that.getcodeimage();
          let ordernumber = SWuserInfo.payLog[0].ordernumber;
          VIPnumber = ordernumber.substring(ordernumber.length - 9, ordernumber.length - 1);
        }
        that.setData({
          VIPnumber: VIPnumber,
        })
      }
    }else{
      wx.stopPullDownRefresh()
      that.setData({
        SWuserInfo: SWuserInfo
      })
      let VIPnumber;
      if ( SWuserInfo.payLog != undefined && SWuserInfo.payLog.length > 0) {
        // that.getcodeimage();
        let ordernumber = SWuserInfo.payLog[0].ordernumber;
        VIPnumber = ordernumber.substring(ordernumber.length - 9, ordernumber.length - 1);
      }
      that.setData({
        VIPnumber: VIPnumber,
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getblackcardinfo();
    that.getuserinfo();
    that.getSWuserInfo();
    that.setData({
      ip:app.ip,
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.getUserInfo(that.getSWuserInfo());
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})