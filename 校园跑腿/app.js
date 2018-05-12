//app.js
App({
  ip: "https://www.tongzhuhe.com/run",
  //ip: "http://192.168.0.108/frame",
  //ip: "http://192.168.1.78/frame",
  imgip:"https://www.tongzhuhe.com",
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
  setWindowSize(that) {
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          innerHeight: res.windowHeight,
          innerWidth: res.windowWidth
        })
      },
    })
  },
  showModel: function (title, content, success, fail) {
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
      fail: function (res) {
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
  showSuccessToast(title, duration) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 2000
    })
  },
  updateUserInfo:function(userInfo){
    let that = this;
    let updateUserInfo={
      sunwouId: that.globalData.userInfo.sunwouId,
      avatarUrl: userInfo.avatarUrl,
      province: userInfo.province,
      gender: userInfo.gender == 1 ? "男" : userInfo.gender == 2?"女":"未知",
      nickName: userInfo.nickName,
      city:userInfo.city,
    }
    that.post("/user/update", updateUserInfo,function(res){
      if (res.code) {
        that.globalData.userInfo = res.params.user
      }
    })
  },
  getuserinfo: function (e) {
    let that = this;
    let WXuserInfo = wx.getStorageSync("WXuserInfo");
    // if (WXuserInfo != null && WXuserInfo != undefined && WXuserInfo != {} && WXuserInfo != '') {
      if (false) {
    } else {
      wx.getUserInfo({
        lang:"zh_CN",
        success: function (res) {
          wx.setStorageSync('WXuserInfo', res.userInfo)
          that.updateUserInfo(res.userInfo)
        },
        fail(res) {
          that.showModel("提示", "请先授权获取用户信息！！", function (res) {
            wx.openSetting({
              success: (res) => {
                wx.getUserInfo({
                  lang: "zh_CN",
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
    }
  },
  timediffnow: function (order) {
    let thedate = new Date(order.createTime);
    let nowdate = new Date();
    let timediff = parseInt((nowdate.getTime() - thedate.getTime()) / 1000);
    let year = Math.floor(timediff / 86400 / 365);
    timediff = timediff % (86400 * 365);
    let month = Math.floor(timediff / 86400 / 30);
    timediff = timediff % (86400 * 30);
    let day = Math.floor(timediff / 86400);
    timediff = timediff % 86400;
    let hour = Math.floor(timediff / 3600);
    timediff = timediff % 3600;
    let minute = Math.floor(timediff / 60);
    timediff = timediff % 60;
    let second = timediff;
    if (year >= 1) {
      order.timediff = year + "年前";
    } else if (month >= 1) {
      order.timediff = year + "个月前";
    } else if (day >= 1) {
      order.timediff = day + "天前";
    } else if (hour >= 1) {
      order.timediff = hour + "小时前";
    } else if (minute >= 1) {
      order.timediff = minute + "分钟前";
    } else if (second >= 1) {
      order.timediff = second + "秒前";
    }
  },
  getsender: function (e) {
    let that=this;
      let query = {
        fields: ["realName", "classesNumber", "images", "status","money"],
        wheres: [{
          value: "userId", opertionType: "equal", opertionValue: that.globalData.userInfo.sunwouId
        }]
      }
      that.post("/sender/find", { query: JSON.stringify(query) }, function (res) {
        if (res.code) {
          if (res.params.senders != undefined && res.params.senders.length > 0) {
            let sender = res.params.senders[0];
            wx.setStorageSync("sender", sender)
          }
        } else {
          app.showFailToast(res.msg, 2000);
        }
      })
  },
  onLaunch: function () {
    let that=this;
    wx.login({
      success: res => {
        let code=res.code;
        that.post("/user/code2user",{code:code},function(res){
          if(res.code){
            that.globalData.userInfo = res.params.user;
            that.getuserinfo()
            if (res.params.user.senderFlag){
              that.getsender();
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo:{},
    wxUserInfo:{},
    school:{},
    floor:{}
  }
})