var app = getApp();
var that;

Page({

  data: {
    phone: 0,
  },

  onLoad: function (options) {
    that = this;
    that.setData({
      phone: app.globalData.school.phone,
    })
  },

  onShow: function () {
  
  },

  onReady: function () {

  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})