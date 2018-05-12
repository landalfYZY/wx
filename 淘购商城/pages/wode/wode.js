// pages/wode/wode.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swUserInfo:null,
    userInfo:null,
    bgImg: '/images/wode/bgImg.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  becomeWorker(e) {
    let userInfo = app.globalData.userInfo;
    let isdianyuan = wx.getStorageSync("isdianyuan");
    console.info(isdianyuan)
    if (userInfo == null && userInfo.phone == '' && userInfo.phone == undefined && userInfo.phone == null){
      app.showModel("提示", "检查到没有绑定手机号，是否前往绑定？", function (res) {
        wx.navigateTo({
          url: '/pages/myphone/myphone',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      })
    } else if (isdianyuan != null && isdianyuan != undefined && isdianyuan != ''){
      app.showModel("提示", "您已为" + isdianyuan+"申请了店员！")
      }else{
      wx.navigateTo({
        url: '/pages/dianyuan/dianyuan',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  myAbout(e){
    wx.navigateTo({
      url: '/pages/about/about',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  myJiFen(e) {
    wx.navigateTo({
      url: '/pages/jifen/jifen',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  myPhone(e){
    let userInfo = app.globalData.userInfo;
    console.info(userInfo)
    if (userInfo != null && userInfo.phone != '' && userInfo.phone != undefined && userInfo.phone != null) {
      app.showModel("提示", "手机号已成功绑定！！");
    }else{
      wx.navigateTo({
        url: '/pages/myphone/myphone',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  myOrder(e){
    wx.navigateTo({
      url: '/pages/order/order',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  addressManger() {
    var that = this;
    wx.chooseAddress({
      success: function () {
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '为了您的方便请先开启微信地址授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function () {
                  that.addressManger()
                }
              })
            }
          }
        })
      }
    })
  },
  onLoad: function (options) {
    that=this;
    wx.getUserInfo({
      success: function(res) {
        console.info(res)
        that.setData({
          userInfo:res.userInfo
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userId = app.globalData.userId;
    console.info(userId);
    if (userId != null) {
      app.post('user/findbyuserid', {
        userId: userId
      }, function (res) {
        console.info(res);
        that.setData({
          swUserInfo:res.body
        })
      })
    }
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