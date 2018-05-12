// pages/contextus/contextus.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  setClipboardData(){
    app.showModel("复制到剪切板","是否复制微信号到剪切板？",function(res){
      wx.setClipboardData({
        data: 'August2354',
        success: function (res) {
          app.showSuccessToast("复制成功",2000);
        }
      })
    })
    

  },
  callphone(){
    app.showModel("拨打电话","是否拨打电话17858511197？",function(){
      wx.makePhoneCall({
        phoneNumber: '17858511197' //仅为示例，并非真实的电话号码
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;

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