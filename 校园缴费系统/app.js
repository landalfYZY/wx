App({
  onLaunch: function () {
    var that = this;
    that.getuser(function(){

    });
  },

  getuser: function (cb) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.login({
      success: function (res) {
        that.post('/wxuser/login', {code: res.code, appid: 'sunwou20180621104109698'}, function (res) {
          if (res.data.code) {
            //成功获取用户信息
            that.globalData.user = res.data.params;
            wx.setStorageSync('user', res.data.params)
            wx.hideLoading()
          }
          cb(res)
        })
      }
    })
  },
  globalData: {
    IP: 'https://www.sunwou.com/jf/',
    // IP: 'https://192.168.31.250/frame/',
    user: {},
    school: {},
  },

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
