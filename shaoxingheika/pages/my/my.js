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
  navtocontextus:function(e){
    wx.navigateTo({
      url: '/pages/contextus/contextus',
    })
  },
  navtomygroupbuy:function(e){
    wx.navigateTo({
      url: '/pages/mygroup/mygroup',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  mydiscount: function (e) {
    wx.navigateTo({
      url: '/pages/mydiscount/mydiscount',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
        userId: userId,
        shopId: that.data.shopId,
      }, function (res) {
        if (res.code == 1000) {
          app.showSuccessToast("核销成功", 2500);
        } else {
          app.showFailToast(res.result, 2500);
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
    if (order.status != '2') {
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
      status:'4',
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
          }else if(sunwouInfo.type=="group"){
            that.hxgroup(sunwouInfo)
          }

        } else {
          app.showModel("提示", "二维码有误，请重试！！");
        }
      }
    })
  },
  hxgroup(sunwouInfo){
    let shopId = sunwouInfo.shopId;
    let orderId = sunwouInfo.orderId;
    if (shopId != undefined && shopId != null && shopId != '' && orderId != undefined && orderId != null && orderId != '' && shopId == that.data.shopId) {
      that.findCoupon(orderId);
    } else {
      that.showfailpage("此优惠券不在此商户处使用！！或者优惠券信息有误！！");
    }
  },
  findCoupon(orderId){
    app.post("HuangCardPingTuan/usercoupon/findCoupon.do",{
      ucpon_id:orderId,
      isable:true,
    },function(res){
      console.info(res);
      if(res.code){
        if(res.params!=undefined&&res.params.result!=undefined){
          if(res.params.result.length>0){
            if (res.params.result[0].isavailable){
              that.updateconpon(res.params.result[0])
            }
          }
        }else{
          that.showfailpage("此优惠券已过期！！");
        }
      }else{
        that.showfailpage("小程序错误，请联系开发商！！！");
      }
    })
  },
  // hxgrouplog(conpon){
  //   app.post("shop/shopuselogadd", {
  //     userId: conpon.fk_us_id,
  //     shopId: that.data.shopId,
  //     message: conpon.ucpon_info
  //   }, function (res) {
  //     if (res.code == 1000) {
  //       that.updateconpon(conpon)
  //     } else {
  //       that.showfailpage(res.result);
  //     }
  //   },
  //     function (res) {
  //       that.showfailpage("程序错误！！请联系黑卡官方！");
  //     }
  //   )
  // },
  updateconpon(conpon){
    app.post("HuangCardPingTuan/usercoupon/updateCouponAvailable.do", {
      ucpon_id: conpon.ucpon_id,
      isavailable: false,
    }, function (res) {
      if (res.code) {
        that.showsuccesspage(conpon.ucpon_info);
      }else{
        that.showfailpage("扫码成功，核销修改优惠券为已使用的时候出错！！");
      }
    }, function (res) {
      that.showfailpage("程序错误！！请联系黑卡官方！");
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
    wx.navigateTo({
      url: '/pages/bindphone/bindphone',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  updateUserInfo:function(userInfo){
    app.post("HuangCardPingTuan/userinfo/updateUserInfo.do",{
      us_id: that.data.SWuserInfo.sunwouId,
      nickname: userInfo.nickName,
      city: app.globalData.city,
      icon: userInfo.avatarUrl
    },function(res){
      console.info(res)
    })
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
          that.updateUserInfo(res.userInfo)
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
                    that.updateUserInfo(res.userInfo)
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
      console.info(res);
      if (res.code == 1000) {
        that.setData({
          shopId: res.result
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getuserinfo();
    that.getcodeimage();
    that.checkshoper();
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