var app = getApp();
var that;
var com = require('../../../utils/common.js');
Page({
  data: {
    flag:-1,
    price:0,
    load:false,
    coupon: []
  },
  useIt(e){
    var index = e.currentTarget.dataset.index;
    var prePage = com.prePage();

    if(this.data.flag == -1){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }else{
      prePage.setData({
        couponId:that.data.coupon[index].sunwouId
      })
      wx.navigateBack({
        delta:1
      })
    }
  },
  onLoad: function(options) {
    that = this;
    this.getCoupon();
    if(options.flag){
      this.setData({
        flag: options.flag,
        price: options.price
      })
    }
  },
  getCoupon(){
    this.setData({
      load:true
    })
    com.getCoupon(null,function(res){
      that.setData({
        load:false,
        coupon:res.params.msg
      })
    })
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