//app.js
App({
  onLaunch: function () {
   
  },
  
  globalData: {
    userInfo: null
  },
    //获取屏幕实际大小
  getWindow: function (that) {
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          innerHeight: res.windowHeight,
          innerWidth: res.windowWidth
        })
      },
    })
  },
})