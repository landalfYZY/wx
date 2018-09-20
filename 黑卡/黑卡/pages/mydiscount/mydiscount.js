// pages/mydiscount/mydiscount.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    list:[],
    codeimage:"",
    maskhidden:true
  },
  hiddenmask:function(e){
    that.setData({
      maskhidden:true,
      codeimage:""
    })
  },
  showcodeimage:function(e){
    console.info("二维码展示");
    let orderId = e.currentTarget.dataset.orderid;
    let shopId = e.currentTarget.dataset.shopid;
    app.post("user/barcode", {
      content: JSON.stringify({ orderId: orderId,shopId:shopId,type:"discount" }),
      appid: app.sunwouId
    }, function (res) {
      if (res.code == 1000) {
        res.body = res.body.replace(/\n/g, '');
        that.setData({
          maskhidden:false,
          codeimage: res.body
        })
      }
    });
  },
  navtoshop:function(e){
    
    let sunwouId = e.currentTarget.dataset.shopid;
    console.info(sunwouId);
    wx.navigateTo({
      url: '/pages/shop/shop?sunwouId=' + sunwouId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      loading: true,
    })
    app.post("shop/findorderhk", { userId: app.globalData.SWuserInfo.sunwouId},function(res){
      console.info(res);
      that.setData({
        loading: false,
        list: res.body
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