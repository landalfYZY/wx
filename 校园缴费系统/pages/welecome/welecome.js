// pages/welecome/welecome.js
var app = getApp();

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactPerson:'',
    tel:'',
    detailAddress:''
  },
  //联系人
  contactPersonInput: function (e) {
    that.data.contactPerson = e.detail.value
  },
  //联系方式
  telInput: function (e) {
    that.data.tel = e.detail.value
  },
  //验证码
  detailAddressInput: function (e) {
    that.data.detailAddress = e.detail.value
  },

  //点击保存
  saveNewAdres: function (e) {
    //新建联系人信息
    console.log(e)
    if (that.data.contactPerson == "" || that.data.tel == "" || that.data.detailAddress == "") {
      wx.showToast({
        title: "请输入完整信息",
        image: '/images/tanHao.png',
        duration: 2000,
        mask: true
      })
    } else{
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      //更新传回去给服务器
      app.post('/wxuser/regist', { avatarUrl: e.detail.userInfo ? e.detail.userInfo.avatarUrl : '', nickName: e.detail.userInfo ? e.detail.userInfo.nickName : '', phone: that.data.tel, realName: that.data.contactPerson, sunwouId: wx.getStorageSync("user").msg.sunwouId, gender: e.detail.userInfo ? e.detail.userInfo.gender : '', city: e.detail.userInfo ? e.detail.userInfo.city : '', province: e.detail.userInfo ? e.detail.userInfo.province : ''}, function (res) {
        if (res.data.code) {
          //成功
          wx.setStorageSync('user', res.data.params)
          wx.hideLoading()
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   that = this
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