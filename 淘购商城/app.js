//app.js
var that;
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  sunwouId:'5a12ab9c318a20055818cf05',
  pageSize:5,
  ip:'https://www.tongzhuhe.com/',
  //ip:'http://192.168.5.69/',
  showModel: function (title, content,success) {
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (typeof success =="function"){
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
      duration: 2000
    })
  },
  showSuccessToast(title, duration) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 2000
    })
  },
  getSystemInfoSync: function (option) {
    try {
      var res = wx.getSystemInfoSync()
      console.info(res);
      option.setData({
        windowHeight: res.windowHeight,
        windowWidth: res.windowWidth
      })
    } catch (e) {
      // Do something when catch error
    }

  },
  getUserInfo: function (e) {
    that.post("user/findbyuserid", { userId: that.globalData.userId }, function (res) {
      that.globalData.userInfo=res.body;
    })
  },
  onLaunch: function () {
    that = this;
    wx.login({
      success: function(res) {
        console.info(res);
        that.post('user/appid2userid', { 
            appid: that.sunwouId,
            code:res.code,
            clientName:'wx'
          },
          function(res){
            console.info(res);
            if(res.code==1000){
            that.globalData.userId=res.body;
            that.getUserInfo();
            }
          })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
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
    userInfo:null,
    userId: null
  }
})
