const APPID = 'wxa1eb92d785421f14';
const API   = 'https://www.sunwou.com/hd/';
//const API   = 'http://192.168.31.250/jf/';
const ATYPE = [
  "电影", "KTV", "酒吧", "运动", "打球", "竞技", "旅游", "课程", "其他"
]
const PERPLE_NUM = [
  "不限",1,2,3,4,5,6,7,8,9,10,'10个以上'
]
const DAY_NUM = [1,2,3,4,5,6,'一周','一个月','长期']
function login(cb){
  wx.login({
    success(res){
      var code = res.code;
      get('wxuser/login', { code: code }, function (res) {
        if(res.code){
          wx.setStorageSync("user", res.params.msg);
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
        wx.setStorageSync("user", res.params.msg);
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
  APPID:APPID,
  API:API,
  post: post,
  get:get,
  http:http,
  getWindowSize: getWindowSize,
  login:login,
  updateUser: updateUser ,
  ATYPE:ATYPE,
  PERPLE_NUM: PERPLE_NUM,
  DAY_NUM: DAY_NUM
}
