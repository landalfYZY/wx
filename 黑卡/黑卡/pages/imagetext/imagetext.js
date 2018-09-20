// pages/imagetext/imagetext.js
let WxParse = require('../../utils/wxParse/wxParse.js');
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sunwouId:'',
    ip:'',
    imagetext:{}
  },
  getshopinfo(sunwouId){
    app.post("shop/findimageandtext",{
      appid: app.sunwouId,
      type: '2',
      sunwouId:sunwouId
    },function(res){
      res.body[0].sor = res.body[0].sort.length == 14 ? [] : res.body[0].sort.split(',');
      that.setData({
        imagetext:res.body[0]
      })
      WxParse.wxParse('article', 'html', res.body[0].text, that, 5);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    let sunwouId=options.sunwouId;
    that.setData({
      sunwouId:sunwouId,
      ip:app.ip,
    })
    that.getshopinfo(sunwouId)
    
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