//app.js
let that;
App({
  sunwouId: "5a571576318a206bec5b3aa1",
  appid: "wx7a4602bec32ad82c",
  secret: "d83455c15e11972f089ca18646046264",
  card_id: "pEnlc1kB9buhgt6zvBS9JnpZTci8",
  pageSize: 5,
  ip: 'https://www.sunwou.com/',
  //ip:"http://192.168.5.69/",
  getUserInfo: function (success) {
    let _success = success || function (e) {
      console.log(e)
    };
    that.post("user/findbyuserid", { userId: that.globalData.userId }, function (res) {
      that.globalData.SWuserInfo = res.body;
      wx.setStorageSync('SWuserInfo', res.body);
      if (typeof _success == 'function') {
        _success(res.body);
      } else {
        console.log(`========  ${_success} 不是一个方法 ========`);
      }
    })
  },
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (str.indexOf('{') > -1) {
          return true;
        } else {
          return false;
        }

      } catch (e) {
        console.log(e);
        return false;
      }
    }
    return false;
  },
  showModel: function (title, content, success) {
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (typeof success == "function") {
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
  getACCESS_TOKEN: function (success) {
    let _success = success || function (e) {
      console.log(e)
    };
    that.post("shop/getcar", {
      appid: that.appid,
      secert: that.secret
    }, function (res) {
      console.info(res);
      if (typeof _success == 'function' && res.statusCode != 404 && res.statusCode != 500 && res.statusCode != 400) {
        _success(res.body);
      } else {
        if (typeof _success != 'function') {
        }
      }
    })
  },
  getlocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let wgspoint = { latitude: res.latitude, longitude: res.longitude };
        wx.request({
          url: "https://api.map.baidu.com/geoconv/v1/",
          data: {
            coords: wgspoint.longitude + "," + wgspoint.latitude,
            ak: "zELhDs2nq8bUK4zscd5reurcjNauEohW",
            from: 1,
            to: 5,
          },
          success: function (res) {
            if (res.data.status == 0) {
              let BDpoint = { longitude: res.data.result[0].x, latitude: res.data.result[0].y };
              that.globalData.locationpoint = BDpoint;
            } else {
              that.showFailToast("获取位置错误");
            }

          }
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLaunch: function () {
    that = this;
    wx.login({
      success: function (res) {
        that.post('user/appid2userid', {
          appid: that.sunwouId,
          code: res.code,
          clientName: 'wx'
        },
          function (res) {
            if (res.code == 1000) {
              that.globalData.userId = res.body;
              that.getUserInfo();
            }
          })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    that.getlocation();
    
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
    userId: null,
    SWuserInfo: null,
    locationpoint: null
  }
})