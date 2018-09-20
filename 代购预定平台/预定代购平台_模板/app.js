var util = require('./utils/util.js')
App({
  onLaunch: function () {
    util.login(function (res) {
      console.log(res)
    })
  },

  //登录接口
  login: function (cb) {
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        that.post('api/wx/login', { js_code: code }, function (res) {
          cb(res)
        })
      }
    })
  },
  //获取用户信息接口
  getUserInfo: function (user,cb) {
    var that = this;
        that.post('api/wx/update', {
          openid: wx.getStorageSync('user').openid,
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          province: user.province,
          city: user.city,
          gender: user.gender
        }, function (res) {
          if (res.code) {
            wx.setStorageSync('user', res.result);
            cb(res)
          } else {
            wx.showToast({
              title: res.msg,
            })
          }
        })
 
  },
  //ip: 'https://www.sunwou.com/sunwou/',
  ip:'http://localhost:8000/',
  post: function (url, data, success, fail, method) {
    //通用post接口实现方法
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
  }
})