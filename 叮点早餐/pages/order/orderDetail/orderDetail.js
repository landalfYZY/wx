var app = getApp();
var that;

Page({

  data: {
    discountPrice: 0,
    payment: 0
  },

  onLoad: function (options) {
    that = this;
    var orderId = options.orderId;
    var query = {
      wheres: [{ value: "sunwouId", opertionType: "equal", opertionValue: orderId }],
      fields: ['shopName', 'shopId', 'shopPhone', 'shopImage', 'shopAddress', 'address.schoolName', 'address.floorName', 'address.concatName', 'address.concatPhone', 'address.detail', 'status', 'type', 'orderProduct', 'discountType', 'sendPrice', 'boxPrice', 'productPrice', 'shopdiscount', 'appdiscount', 'total', 'sunwouId', 'remark', 'reserveTime', 'waterNumber', 'createTime', 'senderName', 'senderPhone', 'senderId', 'secret'],
    }
    //查询订单
    app.post('/order/find', { query: JSON.stringify(query) }, function (res) {
      if (res.data.code) {
        //成功        
        let order = res.data.params.orders[0];
        if (res.data.params.orders[0].type == '外卖订单' || res.data.params.orders[0].type == '自取订单') {
          for (var i = 0; i < order.orderProduct.length; i++) {
            order.orderProduct[i].attribute.zkprice = order.orderProduct[i].product.discount * order.orderProduct[i].attribute.price;
          }
        }
        that.setData({
          order: order,
          discountPrice: (order.shopdiscount + order.appdiscount).toFixed(1),
          payment: (order.total).toFixed(1)
        })
      }
    })
  },

  //取消订单
  cancel: function () {
    wx.showModal({
      title: '提示',
      content: '是否确认取消订单',
      showCancel: true,
      confirmColor: '#3797ee',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          app.post('/order/cancel', { orderId: that.data.order.sunwouId }, function (res) {
            wx.hideLoading()
            if (res.data.code) {
              //成功
              wx.showToast({
                title: '退款成功',
                icon: '/images/success.png',
                duration: 2000,
                mask: true
              })
              wx.navigateTo({
                url: "/pages/order/orderDetail/orderDetail?orderId=" + that.data.order.sunwouId
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                confirmColor: '#3797ee',
                confirmText: '朕知道了',
                success: function (res) {
                  if (res.confirm) {
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  //联系骑手
  runPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: that.data.order.senderPhone,
    })
  },

  //超时反馈
  exceed: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.school.phone,
    })
  },

  //联系商家
  shopPhone: function () {
    wx.makePhoneCall({
      phoneNumber: that.data.order.shopPhone,
    })
  },

  //骑手位置
  runLocation: function () {
    var query = {
      wheres: [{ value: "sunwouId", opertionType: "equal", opertionValue: that.data.order.senderId }],
      fields: ['lng', 'lat']
    };
    app.post('/sender/find', { query: JSON.stringify(query) }, function (res) {
      if (res.data.code) {
        //成功
        wx.request({
          url: 'https://api.map.baidu.com/' + 'geoconv/v1/',
          method: 'get',
          dataType: 'json',
          data: {
            from: 5,
            to: 3,
            coords: res.data.params.senders[0].lng + ',' + res.data.params.senders[0].lat,
            output: 'json',
            ak: 'oRYkfitFSo3DxFdy8aI9y2PiQ6Km2DjC'
          },
          success: function (res) {
            wx.openLocation({
              latitude: res.data.result[0].y,
              longitude: res.data.result[0].x,
              scale: 28
            })
          }
        })
      }
    })
  },

  wxPay: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (that.data.order.shopId) {
      app.post('/shop/findById', { sunwouId: that.data.order.shopId }, function (res) {
        if (res.data.code) {
          //成功
          if (res.data.params.shop.open == false && res.data.params.shop.OpenTime) {
            wx.hideLoading()
            var print = '营业时间\t';
            for (var i = 0; i < res.data.params.shop.OpenTime.length; i++) {
              print += res.data.params.shop.OpenTime[i].start + "-" + res.data.params.shop.OpenTime[i].end + ",";
            };
            wx.showModal({
              title: '提示',
              content: print,
              showCancel: false,
              confirmColor: '#3797ee',
              confirmText: '朕知道了',
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          } else if (res.data.params.shop.open == false && !res.data.params.shop.OpenTime) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '商家停止接单了',
              showCancel: false,
              confirmColor: '#3797ee',
              confirmText: '朕知道了',
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          } else {
            app.post("order/pay", {
              sunwouId: that.data.order.sunwouId,
              payment: '微信支付'
            }, function (res) {
              wx.hideLoading()
              let msg = res.data.params.msg;
              wx.requestPayment({
                timeStamp: msg.time,
                nonceStr: msg.nonceStr,
                package: 'prepay_id=' + msg.prepay_id,
                signType: 'MD5',
                paySign: msg.paySign,
                success: function (res) {
                  wx.redirectTo({
                    url: "/pages/order/orderDetail/orderDetail?orderId=" + that.data.order.sunwouId
                  })
                },
                fail: function () {
                  wx.redirectTo({
                    url: "/pages/order/orderDetail/orderDetail?orderId=" + that.data.order.sunwouId
                  })
                }
              })
            })
          }
        }
      })
    } else {
      app.post("order/pay", {
        sunwouId: that.data.order.sunwouId,
        payment: '微信支付'
      }, function (res) {
        wx.hideLoading()
        let msg = res.data.params.msg;
        wx.requestPayment({
          timeStamp: msg.time,
          nonceStr: msg.nonceStr,
          package: 'prepay_id=' + msg.prepay_id,
          signType: 'MD5',
          paySign: msg.paySign,
          success: function (res) {
            wx.redirectTo({
              url: "/pages/order/orderDetail/orderDetail?orderId=" + that.data.order.sunwouId
            })
          },
          fail: function () {
            wx.redirectTo({
              url: "/pages/order/orderDetail/orderDetail?orderId=" + that.data.order.sunwouId
            })
          }
        })
      })
    }
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },


})