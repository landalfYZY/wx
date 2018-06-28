// pages/mine/minde.js
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
    list: [
      {
        title: '收货地址',
        src: '/images/location.png'
      }, {
        title: '我的卡包',
        desc: '0',
        slot: false,
        src: '/images/kaBao.png'
      }, {
        title: '优惠券',
        desc: '0',
        slot: false,
        src: '/images/quan.png'
      }, {
        title: '积分商城',
        desc: '0',
        slot: false,
        src: '/images/jiFen.png'
      },],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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