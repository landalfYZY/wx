var app = getApp();
var that;

Page({

  data: {
    list: [{
      title: '收货地址',
      src: '/images/location2.png',
      bind: 'navToLocation'
    },],
  },

  onLoad: function(options) {
    that = this
  },

  onShow: function() {

  },

  navToLocation: function() {
    wx.navigateTo({
      url: '/pages/mine/location/location',
    })
  },

  navToRunner: function() {
    wx.navigateTo({
      url: '/pages/mine/applyRunner/applyRunner',
    })
  },

  navToCoupon: function () {
    wx.navigateTo({
      url: '/pages/mine/coupon/coupon',
    })
  },

  navToIntegral: function () {
    wx.navigateTo({
      url: '/pages/mine/integral/integral',
    })
  },

  navToAbout: function () {
    wx.navigateTo({
      url: '/pages/mine/about/about',
    })
  },

  navToHelp: function () {
    wx.navigateTo({
      url: '/pages/mine/help/help',
    })
  },

  onHide: function() {

  },

  onReady: function() {

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