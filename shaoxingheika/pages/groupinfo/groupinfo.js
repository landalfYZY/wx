// pages/groupinfo/groupinfo.js
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip:'',
    groupInfo:{},

  },
  navtoshop: function (e) {
    wx.redirectTo({
      url: '/pages/shop/shop?sunwouId=' + that.data.groupInfo.shopId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  begingroup:function(e){
    let userInfo = app.globalData.SWuserInfo;
    let openid = userInfo.userIdWX;
    that.costgroupbuy(openid);
  },
  opengroup(){
    
  },
  costgroupbuy: function (openid){
    app.post("HuangCardPingTuan/creategroup/payCost.do",{
      openid: openid,
      gr_id: that.data.groupInfo.gr_id
    },function(res){
      console.info(res);
      that.wxpay(res.params.result)
    })
  },
  //微信支付
  wxpay: function (data) {
    console.info(data)
    wx.requestPayment({
      'timeStamp': data.time,
      'nonceStr': data.nonceStr,
      'package': 'prepay_id=' + data.prepay_id,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        that.creatgroup(data.prepay_id);
      },
      'fail': function (res) {
        console.info(res);
      },
    })
  },
  creatgroup: function (prepay_id){
    let userInfo = wx.getStorageSync('WXuserInfo');
    app.post("HuangCardPingTuan/creategroup/add.do",{
      fk_gr_id: that.data.groupInfo.gr_id,
      fk_us_id: app.globalData.SWuserInfo.sunwouId,
      usericon: userInfo.avatarUrl,
      usernickname: userInfo.nickName,
      preptyid: prepay_id
    },function(res){
      console.info(res);
      let id=res.params.result;
      wx.navigateTo({
        url: '/pages/begininggroup/begininggroup?id='+id,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  },

  getgrouplist(gr_id) {
    app.post("HuangCardPingTuan/groupinfo/findYouWant.do", {
      page:1,
      size:1,
      gr_id: gr_id,
      isable: true,
      gr_online: true
    }, function (res) {
      console.info(res);
      if (res.code && res.params != undefined && res.params.list != undefined && res.params.list.length > 0) {
        let groupInfo=res.params.list[0];
        that.setData({
          groupInfo: groupInfo,
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      ip:app.ip
    })
    let gr_id = options.id;
    that.getgrouplist(gr_id)
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