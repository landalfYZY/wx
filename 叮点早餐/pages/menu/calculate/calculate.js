var app = getApp();
var that;

Page({

  data: {
    navBar: [{
      label: '流动点自取',
      active: false
    }, {
      label: '叮点专送',
      active: false
    }, {
      label: '到店自取',
      active: false
    }],
    address: {
      concatName: '请选择默认地址'
    },
    shop: [],
    totalNum: '',
    totalCanhefei: '',
    totalPrice: '',
    cart: [],
    discountflag: null,
    discountPrice: '',
    times: 0,
    sendPrice: 0,
    otherSendPrice: 0,
    payment: 0,
    floorId: '',
    remark: '',
    takeout: true,
  },

  onLoad: function(options) {
    that = this
    let shop = JSON.parse(options.shop);
    let sendTime = shop.sendTime;
    let sendPrice = shop.sendPrice;
    that.data.times = that.haveSomeMinutesTime(Number(sendTime));
    // if (shop.sendModel == true && shop.getModel == true) {
    //   that.data.navBar[0].active = false;
    //   that.data.navBar[1].active = true;
    //   that.data.navBar[2].active = false;
    //   that.data.times = that.haveSomeMinutesTime(Number(sendTime));
    // } else if (shop.sendModel == true) {
    //   that.data.navBar[0].active = false;
    //   that.data.navBar[1].active = true;
    //   that.data.navBar[2].active = false;
    //   that.data.times = that.haveSomeMinutesTime(Number(sendTime));
    //   wx.showModal({
    //     title: '提示',
    //     content: '该店目前仅支持叮点专送',
    //     showCancel: false,
    //     confirmColor: '#3797ee',
    //     confirmText: '朕知道了',
    //     success: function(res) {
    //       if (res.confirm) {}
    //     }
    //   })
    // } else if (shop.getModel == true) {
    //   that.data.navBar[0].active = false;
    //   that.data.navBar[1].active = false;
    //   that.data.navBar[2].active = true;
    //   that.data.takeout = false;
    //   that.data.times = that.haveSomeMinutesTime(20);
    //   sendPrice = 0
    //   wx.showModal({
    //     title: '提示',
    //     content: '该店目前仅支持到店自取',
    //     showCancel: false,
    //     confirmColor: '#3797ee',
    //     confirmText: '朕知道了',
    //     success: function(res) {
    //       if (res.confirm) {}
    //     }
    //   })
    // }
    that.setData({
      tim: that.data.times,
      times: that.data.times,
      navBar: that.data.navBar,
      shop: JSON.parse(options.shop),
      totalNum: options.totalNum,
      totalPrice: parseFloat(options.totalPrice).toFixed(1),
      sendPrice: sendPrice,
      totalCanhefei: parseFloat(options.totalCanhefei).toFixed(1),
      cart: JSON.parse(options.cart),
      discountflag: options.discountflag,
      discountPrice: parseFloat(options.discountPrice).toFixed(1),
      payment: parseFloat(options.payment).toFixed(1)
    })
    that.initParams();
  },

  onShow: function() {
    that.initAddress();
  },

  //缓存如果有默认地址拿出来用
  initAddress: function() {
    if (wx.getStorageSync("defaultAddress")) {
      //获取楼栋地址
      var query = {
        wheres: [{
          value: "schoolId",
          opertionType: "equal",
          opertionValue: wx.getStorageSync("schoolId")
        }, {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        }],
        fields: ['name', 'sunwouId']
      }
      app.post('/floor/find', {
        query: JSON.stringify(query)
      }, function(res) {
        if (res.data.code) {
          for (let i = 0; i < res.data.params.floors.length; i++) {
            if (res.data.params.floors[i].sunwouId == wx.getStorageSync("defaultAddress").floorId) {
              that.setData({
                address: wx.getStorageSync("defaultAddress"),
                floorId: res.data.params.floors[i].sunwouId
              })
              that.otherSendPrice()
            } else {
              wx.showModal({
                title: '提示',
                content: '您默认地址的所在楼栋已被管理员删除，请前往重新编辑默认地址',
                showCancel: false,
                confirmColor: '#3797ee',
                confirmText: '朕知道了',
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/mine/location/location?type=1',
                    })
                  }
                }
              })
            }
          }
        }
      })
    }
    if (wx.getStorageSync("time")){
      var time = wx.getStorageSync("time") + wx.getStorageSync("hol")
      that.setData({
        time: time,

      })
    }
  },

  //获取额外配送费
  otherSendPrice: function() {
    if (wx.getStorageSync("defaultAddress") && that.data.navBar[1].active == true) {
      app.post('/common/completesendmoney', {
        shopId: that.data.shop.sunwouId,
        floorId: that.data.floorId,
      }, function(res) {
        if (res.data.code) {
          //成功    
          that.setData({
            otherSendPrice: res.data.params.money,
            payment: (parseFloat(that.data.totalPrice) + parseFloat(that.data.sendPrice) + parseFloat(that.data.totalCanhefei) + parseFloat(res.data.params.money)).toFixed(1)
          })
        }
      })
    }
  },

  //获取到cart里头的相关内容用于后续的店家订单接口参数
  initParams: function() {
    let cart = this.data.cart;
    let productId = [];
    let numbers = [];
    let attr = [];
    for (let i = 0; i < cart.length; i++) {
      productId.push(cart[i].sunwouId);
      numbers.push(cart[i].num);
      attr.push(cart[i].attIndex);
    }
    this.data.productId = productId;
    this.data.numbers = numbers;
    this.data.attr = attr;
  },

  // 选择到店自取还是外卖上楼
  changeBar: function(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      wx.showModal({
        title: '提示',
        content: '此功能暂时未开放',
        showCancel: false,
        confirmColor: '#3797ee',
        confirmText: '朕知道了',
        success: function(res) {
          if (res.confirm) {}
        }
      })
    } else if (index == 2) {
      for (var i = 0; i < that.data.navBar.length; i++) {
        that.data.navBar[i].active = false;
      }
      if (that.data.shop.getModel == false) {
        that.data.navBar[1].active = true;
        that.otherSendPrice();
        wx.showModal({
          title: '提示',
          content: '该店目前仅支持叮点专送',
          showCancel: false,
          confirmColor: '#3797ee',
          confirmText: '朕知道了',
          success: function(res) {
            if (res.confirm) {}
          }
        })
      } else {
        that.data.navBar[e.currentTarget.dataset.index].active = true;
        that.data.times = that.haveSomeMinutesTime(20);
        var payment = (parseFloat(that.data.payment) - parseFloat(that.data.otherSendPrice) - parseFloat(that.data.sendPrice)).toFixed(1)
        that.setData({
          otherSendPrice: 0,
          tim: that.data.times,
          times: that.data.times,
          sendPrice: 0,
          payment: payment,
          takeout: false
        })
      }
    } else if (index == 1) {
      for (var i = 0; i < that.data.navBar.length; i++) {
        that.data.navBar[i].active = false;
      }
      if (that.data.shop.sendModel == false) {
        that.data.navBar[2].active = true;
        that.setData({
          otherSendPrice: 0,
        })
        wx.showModal({
          title: '提示',
          content: '该店目前仅支持到店自取',
          showCancel: false,
          confirmColor: '#3797ee',
          confirmText: '朕知道了',
          success: function(res) {
            if (res.confirm) {}
          }
        })
      } else {
        that.data.navBar[e.currentTarget.dataset.index].active = true;
        that.otherSendPrice();
        that.data.times = that.haveSomeMinutesTime(Number(that.data.shop.sendTime));
        that.setData({
          tim: that.data.times,
          times: that.data.times,
          sendPrice: that.data.shop.sendPrice,
          takeout: true
        })
      }
    }
    that.setData({
      navBar: that.data.navBar,
    })
  },

  bindTimeChange:function(){
    wx.navigateTo({
      url: '/pages/set/set',
    })
  },

  //跳转到我的界面的地址界面
  moreCusInfo: function() {
    wx.navigateTo({
      url: '/pages/mine/location/location?type=1',
    })
  },

  //相应时间
  haveSomeMinutesTime: function(n) {
    var newDate = new Date()
    var date = newDate.setMinutes(newDate.getMinutes() + n);
    newDate = new Date(date);
    var h = newDate.getHours();
    var m = newDate.getMinutes();
    if (h < 10) {
      h = '0' + h;
    };
    if (m < 10) {
      m = '0' + m;
    };
    var time = h + ':' + m;
    return time;
  },

  // 获取备注
  remark: function(e) {
    that.data.remark = e.detail.value
  },

  // 支付
  wxPay: function() {
    if (!that.data.address.sunwouId) {
      wx.showToast({
        title: '请选择地址',
        image: '/images/tanHao.png',
        duration: 1000,
        mask: true
      })
    } else if (app.globalData.user.sunwouId && that.data.address.sunwouId) {
      that.weixpai()
    } else {
      app.getuser();
      that.weixpai()
    }
  },
  weixpai: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.post('order/addtakeout', {
      shopId: that.data.shop.sunwouId,
      productId: that.data.productId,
      number: that.data.numbers,
      attr: that.data.attr,
      userId: app.globalData.user.sunwouId,
      addressId: that.data.address.sunwouId,
      takeout: that.data.takeout,
      remark: that.data.remark,
      reserveTime: that.data.time,
    }, function(res) {
      if (res.data.code) {
        let sunwouId = res.data.params.sunwouId;
        let payment = '微信支付';
        that.pay(sunwouId, payment);
        that.setData({
          sunwouId: sunwouId,
        })
      } else {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          confirmColor: '#3797ee',
          confirmText: '朕知道了',
          success: function(res) {
            if (res.confirm) {}
          }
        })
      }
    })
  },
  pay: function(sunwouId, payment) {
    app.post("order/pay", {
      sunwouId: sunwouId,
      payment: payment
    }, function(res) {
      wx.hideLoading()
      let msg = res.data.params.msg;
      wx.requestPayment({
        timeStamp: msg.time,
        nonceStr: msg.nonceStr,
        package: 'prepay_id=' + msg.prepay_id,
        signType: 'MD5',
        paySign: msg.paySign,
        success: function(res) {
          wx.redirectTo({
            url: "/pages/order/orderDetail/orderDetail?orderId=" + that.data.sunwouId
          })
        },
        fail: function() {
          wx.redirectTo({
            url: "/pages/order/orderDetail/orderDetail?orderId=" + that.data.sunwouId
          })
        }
      })
    })
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