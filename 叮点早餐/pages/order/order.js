var app = getApp();
var that;

Page({

  data: {
    orders: [],
    totalorders: 1,
  },

  onLoad: function (options) {
    that = this
  },

  onShow: function () {
    this.findOrder()
  },

  //查找订单
  findOrder:function(){
    var query = {
      wheres: [{ value: "schoolId", opertionType: "equal", opertionValue: app.globalData.school.sunwouId }, { value: "userId", opertionType: "equal", opertionValue: app.globalData.user.sunwouId }, { value: 'type', opertionType: 'regex', opertionValue: '外卖订单|堂食订单' }],
      fields: ['shopId', 'shopName', 'shopPhone', 'shopImage', 'status', 'type', 'orderProduct', 'total', 'sunwouId', 'createTime', 'pl', 'waterNumber','senderPhone'],
      pages: { currentPage: 1, size: 5 },
      sorts: [{ value: 'createTime', asc: false }]
    }
    that.data.query = query;
    app.post('/order/find', { query: JSON.stringify(query) }, function (res) {
      if (res.data.code) {
        //成功
        for (var i in res.data.params.orders) {
          res.data.params.orders[i].total = (res.data.params.orders[i].total).toFixed(1);
          switch (res.data.params.orders[i].status) {
            case "待付款": res.data.params.orders[i].style = 0; break;
            case "待接手": res.data.params.orders[i].style = 1; break;
            case "商家已接手": res.data.params.orders[i].style = 2; break;
            case "配送员已接手": res.data.params.orders[i].style = 2; break;
            case "已完成": res.data.params.orders[i].style = 3; break;
            case "已取消": res.data.params.orders[i].style = 4; break;
          }
        }
        that.setData({
          orders: res.data.params.orders,
          totalorders: res.data.params.total,
        })
      }
    })
  },

  //前往详情
  navtos: function (e) {
    wx.navigateTo({
      url: "/pages/order/orderDetail/orderDetail?orderId=" + e.currentTarget.id
    })
  },

  //去店铺再来一单
  toShop:function(e){
    wx.navigateTo({
      url: '/pages/index/item/menu/menu?shopid=' + that.data.orders[e.currentTarget.dataset.index].shopId,
    })
  },

  //联系商家
  shopPhone: function(e){
    wx.makePhoneCall({
      phoneNumber: that.data.orders[e.currentTarget.dataset.index].shopPhone,
    })
  },

  //联系骑手
  runPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: that.data.orders[e.currentTarget.dataset.index].senderPhone,
    })
  },

  //取消订单
  navtos2: function (e) {
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
          app.post('/order/cancel', { orderId: e.currentTarget.id }, function (res) {
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
                url: "/pages/order/orderDetail/orderDetail?orderId=" + e.currentTarget.id
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

  //支付订单
  wxPay: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.post('/shop/findById', { sunwouId: that.data.orders[e.currentTarget.dataset.index].shopId}, function (res) {
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
            sunwouId: e.currentTarget.id,
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
                wx.navigateTo({
                  url: "/pages/order/orderDetail/orderDetail?orderId=" + e.currentTarget.id
                })
              },
              fail: function () {
                wx.navigateTo({
                  url: "/pages/order/orderDetail/orderDetail?orderId=" + e.currentTarget.id
                })
              }
            })
          })
        }
      }
    })
  },

  //评论订单
  navtos3: function (e) {
    wx.navigateTo({
      url: '/pages/order/comment/comment?orderid=' + e.currentTarget.id
    })
  },

  onReady: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onReachBottom: function () {
    var totalorders = that.data.totalorders;
    if (that.data.orders.length < totalorders) {
      var query = that.data.query;
      query.pages.currentPage += 1;
      //查询订单
      app.post('/order/find', { query: JSON.stringify(query) }, function (res) {
        if (res.data.code) {
          //成功
          for (var i in res.data.params.orders) {
            res.data.params.orders[i].total = (res.data.params.orders[i].total).toFixed(1);
            switch (res.data.params.orders[i].status) {
              case "待付款": res.data.params.orders[i].style = 0; break;
              case "待接手": res.data.params.orders[i].style = 1; break;
              case "商家已接手": res.data.params.orders[i].style = 2; break;
              case "配送员已接手": res.data.params.orders[i].style = 2; break;
              case "已完成": res.data.params.orders[i].style = 3; break;
              case "已取消": res.data.params.orders[i].style = 4; break;
            }
          }
          that.setData({
            orders: that.data.orders.concat(res.data.params.orders)
          })
        }
      })
    }
  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function () {

  }
})