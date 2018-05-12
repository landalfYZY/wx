// pages/mycount/mycount.js
const app=getApp();
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    sender:{}
  },
  
  getschool: function (schoolId) {
    let query = {
      fields: ["schoolName","indexTopTitle"],
      wheres: [{
        value: "sunwouId", opertionType: "equal", opertionValue: schoolId
      }]
       };
    app.post("/school/find", { query: JSON.stringify(query) }, function (res) {
      if (res.code) {
        that.setData({
          school: res.params.school
        })
      }
    })
  },

  settitlecolor:function(e){
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#64a8b3',
      animation: {
        duration: 400,
        timingFunc: 'linear'
      }
    })
  },
  pickoutmoney:function(e){
    app.post("/sender/withdrawals",{
      senderId:that.data.sender.sunwouId
    },function(res){
      console.info(res);
    })
  },
  getsender: function (e) {
    let query = {
      fields: ["realName", "classesNumber", "images", "status", "money"],
      wheres: [{
        value: "userId", opertionType: "equal", opertionValue: that.data.userInfo.sunwouId
      }]
    }
    app.post("/sender/find", { query: JSON.stringify(query) }, function (res) {
      if (res.code) {
        if (res.params.senders != undefined && res.params.senders.length > 0) {
          let sender = res.params.senders[0];
          wx.setStorageSync("sender", sender)
          that.setData({
            sender: sender
          })
        }
      } else {
        app.showFailToast(res.msg, 2000);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    })
    that.getsender();
    that.settitlecolor();
    let schoolId=wx.getStorageSync("school").sunwouId;
    that.getschool(schoolId);
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
    return {
      title: '校生源跑腿',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})