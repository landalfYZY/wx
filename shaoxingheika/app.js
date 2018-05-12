//app.js
let that;
App({
  sunwouId:"5a532b36318a206bec78efe4",
  appid:"wx8ebf6aeb679126cb",
  secret:"cee3e0305179664248ee4ee11b01ba57",
  card_id:"pIWGM0qMCT306IqfM2H5SCX9QUp0",
  pageSize: 5,
  ip: 'https://www.tongzhuhe.com/',
  //ip:"http://hanyangji.free.ngrok.cc/",
  //ip:"http://192.168.1.186/",
  getUserInfo: function (e) {
    that.post("user/findbyuserid", { userId: that.globalData.userId }, function (res) {
      that.globalData.SWuserInfo = res.body;
      wx.setStorageSync("SWuserInfo", res.body);
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
  showModel: function (title, content, success,fail) {
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
          if (typeof fail == "function") {
            fail(res)
          }
        }
      },
      fail:function(res){
        if (typeof fail == "function") {
          fail(res)
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
  updateUserInfo: function (userInfo) {
    that.post("HuangCardPingTuan/userinfo/updateUserInfo.do", {
      us_id: that.globalData.SWuserInfo.sunwouId,
      nickname: userInfo.nickName,
      city: that.globalData.city,
      icon: userInfo.avatarUrl
    }, function (res) {
      console.info(res)
    })
  },
  getuserinfo: function (e) {
    // let WXuserInfo = wx.getStorageSync("WXuserInfo");
    // if (WXuserInfo != null && WXuserInfo != undefined && WXuserInfo != {} && WXuserInfo != '') {
    // } else {
      wx.getUserInfo({
        success: function (res) {
          wx.setStorageSync('WXuserInfo', res.userInfo)
          that.updateUserInfo(res.userInfo)
        },
        fail(res) {
          that.showModel("提示", "请先授权获取用户信息！！", function (res) {
            wx.openSetting({
              success: (res) => {
                wx.getUserInfo({
                  success: function (res) {
                    wx.setStorageSync('WXuserInfo', res.userInfo)
                    that.updateUserInfo(res.userInfo)
                  }
                })
              }
            })
          })
        }
      })
    
  },
  showSuccessToast(title, duration) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 2000
    })
  },

  getcity: function (BDpoint){
    wx.request({
      url: "https://api.map.baidu.com/geocoder/v2/",
      data: {
        location: BDpoint.latitude + "," + BDpoint.longitude,
        ak: "zELhDs2nq8bUK4zscd5reurcjNauEohW",
        output: 'json',
        pois: 0,
      },
      success: function (res) {
        if (res.data.status == 0) {
          console.info(res)
          let city = res.data.result.addressComponent.district;
          that.globalData.city=city;
          that.globalData.position = res.data.result.addressComponent;
          that.getuserinfo()
        } else {
          that.showFailToast("获取位置错误");
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
          data:{
            coords: wgspoint.longitude + "," + wgspoint.latitude,
            ak:"zELhDs2nq8bUK4zscd5reurcjNauEohW",
            from:1,
            to:5,
          },
          success:function(res){
            if (res.data.status==0){
              let BDpoint = { longitude: res.data.result[0].x, latitude: res.data.result[0].y };
              that.globalData.locationpoint = BDpoint;
              that.getcity(BDpoint)
            }else{
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
    let SWuserInfo=wx.getStorageSync("SWuserInfo");
    that.globalData.SWuserInfo = SWuserInfo;
    wx.login({
      success: function (res) {
        console.info(res);
        that.post('user/appid2userid', {
          appid: that.sunwouId,
          code: res.code,
          clientName: 'wx'
        },
          function (res) {
            console.info(res);
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
    userId:null,
    position:{},
    SWuserInfo: null,
    locationpoint:{},
    city:''
  }
})