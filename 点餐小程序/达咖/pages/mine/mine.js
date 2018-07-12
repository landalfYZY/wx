const app = getApp()
var com = require('../../utils/common.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  config: {
    usingComponents: {
      'wxc-list': '@minui/wxc-list',
      'wxc-icon': '@minui/wxc-icon'
    }
  },
  data: {
    userInfo:null,
    list: [
      {
        title: '收货地址',
        src: '/images/location.png',
        bind: 'navToLocation'
      }, {
        title: '卡商场',
        desc: '4',
        slot: false,
        src: '/images/kaBao.png',
        bind: 'navToCard'
      }, {
        title: '优惠券',
        desc: '2',
        slot: false,
        src: '/images/quan.png',
        bind: 'navToCoupon'
      },],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.initData()
  },
  initData(){
    var userInfo = null;
    if (wx.getStorageSync("user") && wx.getStorageSync("user").nickName) {
      userInfo = wx.getStorageSync("user")
    }
    this.setData({
      userInfo: userInfo
    })
  },
  getUserInfo(e){
    com.updateUser(e.detail.userInfo,function(res){
      that.initData()
    })
  },

  navToLocation: function () {
    wx.navigateTo({
      url: '/pages/mine/location/location',
    })
  },

  navToCard: function () {
    wx.navigateTo({
      url: '/pages/card/card',
    })
  },

  navToCoupon: function () {
    wx.navigateTo({
      url: '/pages/mine/coupon/coupon',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})