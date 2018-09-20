
//const API   = 'https://www.sunwou.com/dk/';
const API   = 'http://localhost:3000/';

function login(cb){
  wx.login({
    success(res){
      var code = res.code;
      post('users/login', { code: code }, function (res) {
        if(res.code){
          wx.setStorageSync("user", res.data[0]);
          cb(res)
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
        
      })
    }
  })
}

function updateUser(e,cb){
  if(wx.getStorageSync("user")){
    post('wxuser/update',e,function(res){
      if(res.code){
        wx.setStorageSync("user", res.data.data[0]);
        cb(e)
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }else{
    login(function(res){
      if(res.code){
        updateUser(e,cb)
      }
    })
  }
}

function getWindowSize(that){
  wx.getSystemInfo({
    success: function(res) {
      that.setData({
        width:res.windowWidth,
        height:res.windowHeight
      })
    },
  })
}
//post请求
function post(url, data, success, fail) {
  http('POST', url, data, success, fail)
}
function get(url, data, success, fail) {
  http('GET', url, data, success, fail)
}
function http(method, url, data, success, fail) {
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
    url: API + url,
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

module.exports = {
  API:API,
  post: post,
  get:get,
  http:http,
  getWindowSize: getWindowSize,
  login:login,
  updateUser: updateUser 

}
