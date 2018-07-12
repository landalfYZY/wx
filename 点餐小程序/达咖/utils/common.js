const config = {
  //API_URL:'http://192.168.31.250/jf/',
  API_URL:'https://www.sunwou.com/dk/',
  KEY:'oRYkfitFSo3DxFdy8aI9y2PiQ6Km2DjC',
  MAP_API:'https://api.map.baidu.com/'
}
function prePage(){
  var pages = getCurrentPages();
  var beforePage = pages[pages.length - 2];
  return beforePage;
}
function getCoupon(show,cb){
  post('wxusercoupon/mycoupon',{userId:wx.getStorageSync("user").sunwouId},function(res){
    cb(res)
  })
}

function location(callback){
  if (wx.getStorageSync("location")) {
    if (wx.getStorageSync("location").location) {
      callback({
        city: wx.getStorageSync("location").city.replace("市", ""),
        lat: wx.getStorageSync("location").location.lat,
        lng: wx.getStorageSync("location").location.lng
      })
    } else {
      if (wx.getStorageSync("location").lat) {
        callback({
          city: wx.getStorageSync("location").city,
          lat: wx.getStorageSync("location").lat,
          lng: wx.getStorageSync("location").lng
        })
      } else {
        dget(config.MAP_API +'geoconv/v1/', {
          type: 1,
          coords: wx.getStorageSync("location").longitude + ',' + wx.getStorageSync("location").latitude,
          output: 'json',
          ak: config.KEY
        }, function (res) {
          var loc = res.data.result[0];
          dget(config.MAP_API +'geocoder/v2/', {
            location: loc.y + ',' + loc.x,
            ak: config.KEY,
            output: 'json',
          }, function (res) {
            var dg = wx.getStorageSync("location");
            dg.city = res.data.result.addressComponent.city.replace("市", "");
            dg.lat = loc.y;
            dg.lng = loc.x;
            wx.setStorageSync("location", dg);
            callback({
              city: res.data.result.addressComponent.city.replace("市", ""),
              lat: loc.y,
              lng: loc.x
            })
          })
        })
      }

    }
  } else {
    getLocation(function (res) {
      if (res.code) {
        wx.setStorageSync("location", res);
        location(callback)
      } else {
        wxNavgiteTo("location/location")
      }
    })
  }
}
function getLocation(callback){
  wx.getLocation({
    success: function(res) {
      res.code = true;
      callback(res)
    },
    fail: function(res){
      callback({code:false})
    }
  })
}
function updateUser(params,callback){
  var data = params;
  data.sunwouId = wx.getStorageSync("user").sunwouId
  mget('wxuser/update',data,function(res){
    login(function(res){
      callback(res)
    })
  })
}
function login(callback){
  wx.login({
    success(res){
      mget('wxuser/login',{code:res.code},function(res){
        wx.setStorageSync("user", res.params.msg)
        if(callback){
          callback(res)
        }
      })
    }
  })
  
}
/**
 * 设置标题栏颜色
 * front 前景色
 * back 背景色
 */
function setTitleBarColor(front,back){
  wx.setNavigationBarColor({
    frontColor: front,
    backgroundColor: back,
  })
}
//获取窗口宽高
function getWindowSize(that){
  wx.getSystemInfo({
    success: function(res) {
      that.setData({
        innerHeight:res.windowHeight,
        innerWidth: res.windowWidth
      })
    },
  })
}

/**
 * 跳转
 * url 跳转路径
 * props 跳转参数的标签
 * params 跳转参数的值
 */
function wxNavgiteTo(url,props,params){
  var str = '/pages/'+url
  if(props){
    str += '?';
    for (var i in props){
      str += props[i]+"="+ params[props[i]] + '&' 
    }
  }
  wx.navigateTo({
    url: str,
  })
}

/**
 * 查询接口
 */


//post请求
function post (url, data, success, fail) {
  http('POST', url, data, success, fail)
}
function mget(url, data, success, fail){
  http('GET', url, data, success, fail)
}
function http(method,url, data, success, fail){
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
function dget(url,data,callback){
  wx.request({
    url: url,
    method: 'get',
    dataType: 'json',
    data: data,
    success(res) {
      callback(res)
    }
  })
}
module.exports = {
  setTitleBarColor: setTitleBarColor,
  getWindowSize: getWindowSize,
  post:post,
  mget:mget,
  http:http,
  dget,dget,
  API_URL:config.API_URL,
  // query:query,
  wxNavgiteTo: wxNavgiteTo,
  login:login,
  updateUser: updateUser,
  getLocation: getLocation,
  location: location,
  config:config,
  getCoupon: getCoupon,
  prePage: prePage
}