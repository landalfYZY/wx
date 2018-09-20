const config = {
  //API_URL:'http://192.168.31.250/jf/',
  API_URL: 'https://www.sunwou.com/dk/',
  KEY: 'oRYkfitFSo3DxFdy8aI9y2PiQ6Km2DjC',
  MAP_API: 'https://api.map.baidu.com/'
}
function login(data,cb){
  post('user/login',data,function(res){
    if(res.code){
      wx.setStorageSync("user", res.params.msg)
    }else{
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
    }
    cb(res)
  })
}
function post(url, data, success, fail) {
  http('POST', url, data, success, fail)
}
function mget(url, data, success, fail) {
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
    url: config.API_URL + url,
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
  config: config,
  post:post,
  get:mget,
  http:http,
  login: login
}
