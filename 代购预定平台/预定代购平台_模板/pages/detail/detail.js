var that;
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hots: [
      { url: '/img/g4.jpg' },
      { url: '/img/g5.jpg' },
      { url: '/img/g6.jpg' }
    ],
  },
  backToHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width:res.windowWidth,
          id:options.id
        })
      },
    })
    this.getGood()
  },
  getGood(){
    wx.showNavigationBarLoading()
    util.get('goods/findById',{id:this.data.id},function(res){
      wx.hideNavigationBarLoading()
      that.setData({
        msg:res.data.data[0]
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})