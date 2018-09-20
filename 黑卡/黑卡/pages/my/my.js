// pages/my/my.js
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showcodeimage: false,
    showsuccesspage: false,
    showfailpage: false,
    scanfailmsg: "",
    scansuccessmsg:"",
    WXuserInfo: null,
    maskhidden: true,
    SWuserInfo: null,
    codeimage: '',
    ip: '',
    shopId: ''
  },
  bophone(){
    wx.makePhoneCall({
      phoneNumber: '0575-87399999',
    })
  },
  mydiscount: function (e) {
    let SWuserInfo = that.data.SWuserInfo;
    if (SWuserInfo!=undefined && SWuserInfo.payLog!=undefined && SWuserInfo.payLog.length>0){
      
      wx.navigateTo({
        url: '/pages/mydiscount/mydiscount',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      app.showModel("提示","您还没购买黑卡，是否前去购买？",function(res){
        wx.switchTab({
          url: '/pages/blackcard/blackcard',
        })
      })
    }
    
  },
  navtoshopactivity(e) {
    wx.navigateTo({
      url: '/pages/shopactivity/shopactivity?id=' + that.data.shopId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  navtojoinactivity(e) {
    wx.navigateTo({
      url: '/pages/joinactivity/joinactivity',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  hxblackcard: function (sunwouInfo) {
    if (sunwouInfo.sunwouId != undefined && sunwouInfo.sunwouId != null && sunwouInfo.sunwouId != '') {
      let userId = sunwouInfo.sunwouId;
      app.post("shop/shopuselogadd", {
        appid:app.sunwouId,
        userId: userId,
        shopId: that.data.shopId,
      }, function (res) {
        if (res.code == 1000) {
          app.showSuccessToast("核销成功", 2500);
        } else {
          that.showfailpage(res.result)
        }
      },
      function (res) {
        that.showfailpage("程序错误！！请联系黑卡官方！");
      }
      )
    } else {
      app.showModel("提示", "二维码有误，请重试！！");
    }
  },
  showsuccesspage(msg){
    that.setData({
      scansuccessmsg: msg,
      showsuccesspage: true,
      maskhidden: false,
    })
  },
  showfailpage: function (msg) {
    that.setData({
      scanfailmsg: msg,
      showfailpage: true,
      maskhidden: false,
    })
  },
  stringtotimestamp(date) {
    date = date.replace(/-/g, '/');
    var timestamp = Math.round(new Date(date).getTime() / 1000) + 86400;
    return timestamp;
  },
  checkdiscount: function (order) {
    if (order.sort != '1') {
      return false;
    }
    let outtime = that.stringtotimestamp(order.concatPeople);
    let today = Math.round(new Date().getTime() / 1000);
    if (today > outtime) {
      return false;
    }
    return true;
  },
  findorder(orderId){
    app.post("shop/findorder", {
      sunwouId: orderId
    }, function (res) {
      console.info(res);
      if (res.code==1000&&res.body != undefined && res.body != null && res.body.length > 0) {
        let order = res.body[0];
        if (that.checkdiscount(order)) {
          let userId = order.userId;
          let discountinfo = order.addressProvince;
          that.hxdiscountlog(userId, discountinfo, orderId)
        }else{
          that.showfailpage("优惠券已使用或已过期");
        }
      } else {
        that.showfailpage("优惠券信息有误或者不存在！！请联系黑卡官方！");
      }
    })
  },
  hxdiscountlog(userId, discountinfo, orderId){
    console.info(discountinfo)
    app.post("shop/shopuselogadd", {
      appid: app.sunwouId,
      userId: userId,
      shopId: that.data.shopId,
      message: discountinfo
    }, function (res) {
      if (res.code == 1000) {
        that.updateorder(orderId, discountinfo)
      } else {
        that.showfailpage(res.result);
      }
    },
      function (res) {
        that.showfailpage("程序错误！！请联系黑卡官方！");
      }
    )
  },
  updateorder(orderId, discountinfo){
    app.post("shop/orderupdatestatus",{
      orderId: orderId,
      sort:0,
    },function(res){
      if(res.code==1000){
        that.showsuccesspage(discountinfo);
      }
    },function(res){
      that.showfailpage("程序错误！！请联系黑卡官方！");
    })
  },
  hxdiscount: function (sunwouInfo) {
    let shopId = sunwouInfo.shopId;
    let orderId = sunwouInfo.orderId;
    if (shopId != undefined && shopId != null && shopId != '' && orderId != undefined && orderId != null && orderId != '' && shopId == that.data.shopId) {
      that.findorder(orderId)
    } else {
      that.showfailpage("此优惠券不在此商户处使用！！或者优惠券信息有误！！");
    }
  },
  scanofscan: function (e) {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res.result != undefined && res.result != null && app.isJSON(res.result)) {
          let sunwouInfo = JSON.parse(res.result);
          console.info(sunwouInfo)
          if (sunwouInfo.type == "blackcard") {
            that.hxblackcard(sunwouInfo);
          } else if (sunwouInfo.type == "discount") {
            that.hxdiscount(sunwouInfo);
          }

        } else {
          app.showModel("提示", "二维码有误，请重试！！");
        }
      }
    })
  },
  navtoblackcard: function (e) {
    wx.switchTab({
      url: '/pages/blackcard/blackcard',
    })
  },
  showCard: function (e) {
    that.setData({
      maskhidden: false,
      showcodeimage: true,
    })

  },
  getcodeimage: function (e) {
    app.post("user/barcode", {
      content: JSON.stringify({ sunwouId: app.globalData.SWuserInfo.sunwouId, type: "blackcard" }),
      appid: app.sunwouId
    }, function (res) {
      if (res.code == 1000) {
        res.body = res.body.replace(/\n/g, '');
        that.setData({
          codeimage: res.body,
        })
      }
    });
  },
  rescan(){
    that.hiddenmask();
    that.scanofscan();
  },
  hiddenmask: function (e) {
    that.setData({
      showcodeimage: false,
      showsuccesspage: false,
      showfailpage: false,
      maskhidden: true
    })
  },
  bindphone: function (e) {
    let phone = that.data.SWuserInfo.phone
    if (phone!=undefined&&phone!=''){
      app.showModel("提示","您以绑定手机"+phone+",是否重新绑定？",function(res){
        wx.navigateTo({
          url: '/pages/bindphone/bindphone',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      })
    }else{
      wx.navigateTo({
        url: '/pages/bindphone/bindphone',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  getuserinfo: function (e) {
    let WXuserInfo;
    try {
      WXuserInfo = wx.getStorageSync("WXuserInfo");
    } catch (e) {
      console.info(e);
    }
    if (WXuserInfo != null && WXuserInfo != undefined && WXuserInfo != {} && WXuserInfo != "") {
      that.setData({
        WXuserInfo: WXuserInfo
      })
    } else {
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
  checkshoper() {
    app.post("shop/checkshoper", { userId: app.globalData.SWuserInfo.sunwouId }, function (res) {
      if (res.code == 1000) {
        that.setData({
          shopId: res.result
        })
      }
    })
  },
  loadfunction(){
    if (that.data.SWuserInfo==null){
      setTimeout(function(e){
        that.loadfunction();
      },200)
    }else{
      that.getcodeimage();
      that.checkshoper();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getuserinfo();
    that.loadfunction();
    that.setData({
      ip: app.ip
    })
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
    that.setData({
      SWuserInfo: app.globalData.SWuserInfo
    })
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