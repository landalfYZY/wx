//app.js
let that;
App({
  onLaunch: function () {
    that=this;
    wx.login({
      success: function (res) {
        console.info(res);
        that.post('electric/user/my/login/', { code: res.code, clientName:'wx'},function(res){
          console.info(res);
          wx.setStorageSync('loginInfo', res.body);
          that.globalData.userInfo = res.body;
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  ip: 'https://www.tongzhuhe.com/',
  showModel:function(title,content,success){
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          if(success){
            success(res)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showFailToast(title, duration) {
    wx.showToast({
      title: title,
      icon: 'success',
      image: '/images/fail.png',
      duration: duration
    })
  },
  showSuccessToast(title, duration) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: duration
    })
  },

  post: function (url, data, success, fail, method) {
    var that = this;
    let _data = data || {};
    let _success = success || function (e) {
      console.log(e)
    };
    let _fail = fail || function (e) {
      console.log(e)
    };
    let _method = method || 'POST';
    let _header = { 'content-type': 'application/x-www-form-urlencoded' };

    if (_method.toUpperCase() == 'GET') {
      _header = { 'content-type': 'application/json' };
    }
    if (arguments.length == 2 && typeof _data == 'function') {
      _success = _data
    }
    wx.request({
      url: that.ip + url,
      method: _method,
      header: _header,
      data: _data,
      success: function (res) {
        if (typeof _success == 'function' && res.statusCode != 404 && res.statusCode != 500 && res.statusCode != 400) {
          console.log(`======== 接口 ${url} 请求成功 ========`);
          _success(res.data);
        } else {
          if (typeof _success != 'function') {
            console.log(`========  ${_success} 不是一个方法 ========`);
          }
          console.log(`======== 接口 ${url} 错误 ${res.statusCode} ========`);
        }
      },
      fail: function (res) {
        console.log(`======== 接口 ${url} 请求失败 ========`);
        if (typeof _fail == 'function') {
          _fail(res);
        }
      }
    });
  },
  globalData: {
    userInfo: null
  }
})