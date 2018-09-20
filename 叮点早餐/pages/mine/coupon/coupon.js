var app = getApp();
var that;

Page({

  data: {
    coupon: [{
      price: 15,
      cut: "满29元可用",
      title: "果蔬商品优惠券",
      time: "2018-09-10",
      limit: "果蔬商店，商店超市"
    }, {
      price: 20,
      cut: "满40元可用",
      title: "外卖商品优惠券",
      time: "2018-09-10",
      limit: "外卖商店，商店超市"
    }]
  },

  onLoad: function(options) {
    that = this
  },

  onShow: function() {

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