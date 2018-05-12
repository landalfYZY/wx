var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null
  },
  navToRecharge() {
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },
  navToRecord() {
    console.log(11)
    wx.navigateTo({
      url: '/pages/record/record',
    })
  },
  //获取用户信息接口
  getUserInfo: function (cb) {
    var that = this;
    app.login(function(res){
      if (res.code) {
        wx.setStorageSync('app', res.params.user);
        if (res.params.user.phone) {
          wx.setStorageSync('phone', res.params.user.phone)
        }
        that.setData({
          userInfo: res.params.user
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    }) 
   
  },
  
})