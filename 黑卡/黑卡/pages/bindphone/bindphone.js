// pages/myphone/myphone.js
const app = getApp();
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: ''
  },
  codeNumber(e) {
    let code = e.detail.value;
    that.setData({
      code: code
    })
  },
  submit(e) {
    wx.login({
      success: function (res) {
        app.post('user/bind', {
          appid: app.sunwouId,
          code: res.code,
          clientName: 'wx',
          phone: that.data.phone,
          bind_code: that.data.code
        }, function (res) {
          if (res.code == 1000) {
            app.showSuccessToast("绑定成功",1200);
            app.globalData.userId = res.body;
            app.getUserInfo();
            setTimeout(function(e){
              wx.navigateBack({
                delta: 1,
              })
            },1000)
            
          } else {
            app.showFailToast(res.result, 2000);
          }
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  phoneNumber(e) {
    let phone = e.detail.value;
    that.setData({
      phone: phone
    })
  },
  getPhoneCode(e) {
    app.post('user/bind_code', { phone: that.data.phone }, function (res) {
      if(res.code==1000){
        app.showSuccessToast("发送成功",1200);
      }else{
        app.showFailToast(res.result,2000);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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