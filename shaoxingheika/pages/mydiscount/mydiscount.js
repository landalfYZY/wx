// pages/mydiscount/mydiscount.js
const sliderWidth = 110;
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    tabs: ["我团购的", "我购买的"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    list:[],
    codeimage:"",
    maskhidden:true
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  hiddenmask:function(e){
    that.setData({
      maskhidden:true,
      codeimage:""
    })
  },
  showcodeimage:function(e){
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
  showgroupcodeimage: function (e) {
    let orderId = e.currentTarget.dataset.orderid;
    let shopId = e.currentTarget.dataset.shopid;
    app.post("user/barcode", {
      content: JSON.stringify({ orderId: orderId, shopId: shopId, type: "group" }),
      appid: app.sunwouId
    }, function (res) {
      if (res.code == 1000) {
        res.body = res.body.replace(/\n/g, '');
        that.setData({
          maskhidden: false,
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
  findhk(){
    app.post("shop/findorderhk", { userId: app.globalData.SWuserInfo.sunwouId }, function (res) {
      console.info(res);
      that.setData({
        loading: false,
        list: res.body
      })
    })
  },
  mygroupcon(){
    app.post("HuangCardPingTuan/usercoupon/findCoupon.do",{
      fk_us_id:app.globalData.SWuserInfo.sunwouId,
      isable: true,
      isavailable:true
    },function(res){
      console.info(res)
      if (res.params != undefined && res.params.result != undefined && res.params.result.length>0){
        that.setData({
          grouplist: res.params.result
        })
      }
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getSystemInfo();
    that.setData({
      loading: true,
    })
    that.findhk();
    that.mygroupcon()
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