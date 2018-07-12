
const app = getApp()
var com = require('../../utils/common.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getStyle:["自行取货","外卖配送","店内用餐"],
    flag:1,
    sum:0.0,
    address:''
  },
  navTo(e){
    com.wxNavgiteTo(e.currentTarget.dataset.navurl, ["flag","price"], e.currentTarget.dataset)
  },
  navTo2(e) {
    wx.navigateTo({
      url: '/pages/pay/address/address?list='+JSON.stringify(this.data.shop.range),
    })
  },
  bindPickerChange(e){
    this.setData({
      flag: e.detail.value
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      address: wx.getStorageSync("address") ? wx.getStorageSync("address"):'',
      shop:JSON.parse(options.shop),
      cart:JSON.parse(options.cart),
      sum:options.sum
    })
    this.getCoupon()
  },

  getCoupon() {
    com.getCoupon(null, function (res) {
      that.setData({
        coupon: res.params.msg
      })
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