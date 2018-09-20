var app = getApp();
var that;

Page({

  data: {
    selected: false,
    address: [],
    showdetail: true,
    phone: '',
    telInput: '',
    captchaLabel: '获取验证码',
    seconds: 60,
    captchaDisabled: false,
    addressId: '0'
  },

  onLoad: function(options) {
    that = this
    if (options.type) {
      that.data.selected = true;
    }
    if (app.globalData.user.phone) {
      that.setData({
        showdetail: false,
      })
    }
  },

  onShow: function() {
    if (wx.getStorageSync("bianJiAddress")) {
      wx.removeStorageSync('bianJiAddress')
    }
    if (wx.getStorageSync("defaultAddress")) {
      that.setData({
        addressId: wx.getStorageSync("defaultAddress").sunwouId
      })
    } else {
      that.setData({
        addressId: ''
      })
    }
    that.addFind()
  },

  //跳转填写地址界面
  addAddress: function() {
    wx.navigateTo({
      url: '/pages/mine/location/addContact/addContact',
    })
  },

  //输入手机号的值
  phone: function(e) {
    that.data.phone = e.detail.value
  },

  //输入验证码的值
  telInput: function(e) {
    that.data.telInput = e.detail.value
  },

  //获取验证码
  captcha: function(e) {
    app.post('/common/getcode', {
      phone: that.data.phone
    }, function(res) {
      if (res.data.code) {
        that.setData({
          captchaDisabled: true,
        });
        // 启动以1s为步长的倒计时
        let interval = setInterval(() => {
          if (that.data.seconds <= 1) {
            that.data.captchaLabel = '获取验证码';
            that.data.seconds = 60;
            that.setData({
              captchaDisabled: false
            });
          } else {
            that.data.captchaLabel = --that.data.seconds + '秒后重新发送';
            that.setData({
              captchaDisabled: true,
            });
          }
          that.setData({
            seconds: that.data.seconds,
            captchaLabel: that.data.captchaLabel
          });
        }, 1000);
        // 停止倒计时
        setTimeout(function() {
          clearInterval(interval);
        }, 60 * 1000);
      } else {
        wx.showToast({
          title: res.data.msg,
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
      }
    })
  },

  //点击登录
  saveNewAdres: function(e) {
    app.post('/user/bindcode', {
      userId: app.globalData.user.sunwouId,
      phone: that.data.phone,
      code: that.data.telInput
    }, function(res) {
      if (res.data.code) {
        let gender = '未知';
        if (e.detail.userInfo.gender == 1) {
          gender = '男';
        }
        if (e.detail.userInfo.gender == 2) {
          gender = '女';
        }
        app.post('/user/update', {
          sunwouId: app.globalData.user.sunwouId,
          nickName: e.detail.userInfo ? e.detail.userInfo.nickName : '未知',
          avatarUrl: e.detail.userInfo ? e.detail.userInfo.avatarUrl : '未知',
          gender: gender,
          province: e.detail.userInfo ? e.detail.userInfo.province : '未知',
          city: e.detail.userInfo ? e.detail.userInfo.city : '未知'
        }, function(res) {
          //用户信息更新成功
          if (res.data.code) {
            app.globalData.user = res.data.params.user;
            that.setData({
              showdetail: false,
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
      }
    })
  },

  //查询收获地址
  addFind: function() {
    app.post('/address/find', {
      userId: app.globalData.user.sunwouId,
      schoolId: wx.getStorageSync("schoolId"),
    }, function(res) {
      if (res.data.code) {
        if (wx.getStorageSync("addressLength")) {
          wx.setStorageSync("defaultAddress", res.data.params.address[res.data.params.address.length - 1]);
          that.setData({
            addressId: res.data.params.address[res.data.params.address.length - 1].sunwouId
          })
          wx.removeStorageSync('addressLength')
        } else if (wx.getStorageSync("defaultAddressId")) {
          for (var i = 0; i < res.data.params.address.length; i++) {
            if (res.data.params.address[i].sunwouId == wx.getStorageSync("defaultAddressId")) {
              wx.setStorageSync("defaultAddress", res.data.params.address[i]);
            }
          }
          that.setData({
            addressId: wx.getStorageSync("defaultAddressId")
          })
          wx.removeStorageSync('defaultAddressId')
        }
        that.setData({
          address: res.data.params.address
        })
      }
    })
  },

  //删除地址
  delItem: function(e) {
    wx.showModal({
      title: '提示',
      content: '是否确定删除此地址',
      confirmText: '确定',
      confirmColor: '#3797ee',
      success: function(res) {
        if (res.confirm) {
          app.post('/address/update', {
            sunwouId: that.data.address[e.currentTarget.dataset.index].sunwouId,
            isDelete: true
          }, function(res) {
            if (res.data.code) {
              if (that.data.address[e.currentTarget.dataset.index].sunwouId == wx.getStorageSync("defaultAddress").sunwouId) {
                wx.removeStorageSync("defaultAddress");
              }
              that.data.address.splice(e.currentTarget.dataset.index, 1)
              that.setData({
                address: that.data.address
              })
            }
          })
        }
      }
    })
  },

  //编辑地址
  bianJi: function(e) {
    wx.setStorageSync('bianJiAddress', that.data.address[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '/pages/mine/location/addContact/addContact',
    })
  },

  //设为默认地址
  setDefault: function(e) {
    wx.setStorageSync("defaultAddress", that.data.address[e.currentTarget.dataset.index]);
    that.setData({
      addressId: that.data.address[e.currentTarget.dataset.index].sunwouId,
    })
    if (that.data.selected) {
      wx: wx.navigateBack({
        delta: 1,
      })
    }
  },

  onReady: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})