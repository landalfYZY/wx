//app.js
App({
  onLaunch: function () {
    this.login(function(res){
      if (res.code) {
        wx.setStorageSync('app', res.params.user);
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
    this.getProMsg()
  },
  getProMsg(){
    var that = this;
    that.post('miniPro/find', { query: JSON.stringify({ "wheres": [{ "value": "sunwouId", "opertionType": "equal", "opertionValue": that.id }] })},
    function(res){
      if(res.code){
        wx.setStorageSync('appName', res.params.result[0].appName)
        wx.setStorageSync('showData', JSON.parse(res.params.result[0].remakeConfig))
      }
    })
  },
  //登录接口
  login: function (cb) {
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        that.post('wxuser/code2user', { code: code, appid: that.id }, function (res) {
          cb(res)
        })
      }
    })
  },
  //获取用户信息接口
  getUserInfo: function(){
    var that = this;
    wx.getUserInfo({
      success(res){
        that.post('wxuser/update', {
          userId: wx.getStorageSync('app').sunwouId,
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          province: res.userInfo.province,
          city: res.userInfo.city,
          gender: res.userInfo.gender
        }, function (res) {
          if (res.code) {
            wx.setStorageSync('app', res.params.user);
          } else {
            wx.showToast({
              title: res.msg,
            })
          }
        })
      }
    })
  },
  id:'sunwou20180427125258627',
  uid:'sunwou20180427123421438',
  ip:'https://www.sunwou.com/sunwou/',
  phone:'17855889966',
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