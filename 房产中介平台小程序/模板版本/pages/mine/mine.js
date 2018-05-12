var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    userInfo: null
  },
  navTo(){
    wx.navigateTo({
      url: '/pages/follow/follow',
    })
  },
  navToEr(){
    wx.navigateTo({
      url: '/pages/pubhouseList/pubhouseList',
    })
  },
  navToMsg() {
    wx.navigateTo({
      url: '/pages/msg/msg',
    })
  },
  navToCu(){
    wx.navigateTo({
      url: '/pages/midetail/midetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMsgs()
  },
  getMsgs() {
    var that = this;
    if (wx.getStorageSync('app')) {
      if (wx.getStorageSync('app').nickName) {
        this.setData({
          phone: wx.getStorageSync('showData')[0].admin.phone,
          userInfo: wx.getStorageSync('app')
        })
      } else {
        app.getUserInfo(function (res) {
          if (res.code) {
            wx.setStorageSync('app', res.params.user);
            that.setData({
              phone: wx.getStorageSync('showData')[0].admin.phone,
              userInfo: wx.getStorageSync('app')
            })
          } else {
            wx.showToast({
              title: res.msg,
            })

          }
        })
      }
    } else {
      app.login(function (res) {
        if (res.code) {
          that.getMsgs()
          wx.setStorageSync('app', res.params.user);
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
    }
  },
  makephoneCall() {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('showData')[0].admin.phone,
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

})