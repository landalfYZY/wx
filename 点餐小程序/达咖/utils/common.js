var config = {
  API_URL:'http://www.sunwou.com/',
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
function query(fields,wheres,sort,currentPage,size,url,cb){
  var query = {
    fields: fields,
    wheres:wheres,
    sort:sort,
    pages:{
      currentPage: currentPage,
      size:size
    }
  }
  post(url,{query:JSON.stringify(query)},function(res){
    cb(res)
  })
}

//post请求
function post (url, data, success, fail, method) {
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
  setTitleBarColor: setTitleBarColor,
  getWindowSize: getWindowSize,
  post:post,
  API_URL:config.API_URL,
  query:query,
  wxNavgiteTo: wxNavgiteTo
}