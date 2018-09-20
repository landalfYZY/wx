//app.js
App({
  onLaunch: function () {
    var that = this;
    that.getuser();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  //获取用户信息
  getuser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        that.post('user/code2user', { code: res.code }, function (res) {
          if (res.data.code) {
            //成功获取用户信息
            that.globalData.user = res.data.params.user;
          }
        })
      }
    })
  },


  globalData: {
    userInfo: null,
    // IP:'http://192.168.31.250/frame/',
    IP: 'https://www.sunwou.com/zcyd/',
    user: {},
    school: {},
  },

  //请求获取接口的封装
  post: function (url, data, callback) {
    wx.request({
      url: this.globalData.IP + url,
      data: data,
      dataType: 'json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        callback(res);
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '网络状态实在太差，请退出小程序重新试试',
          showCancel: false,
          confirmColor: '#2c3e50',
          confirmText: '确认',
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    })
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