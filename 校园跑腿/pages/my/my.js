// pages/my/my.js
const app=getApp();
let that=this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    ip:"",
    school:{}
  
  },
  settitlecolor: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#b0bcd8',
      animation: {
        duration: 400,
        timingFunc: 'linear'
      }
    })
  },
  navtomycount:function(e){
    if (that.data.userInfo.phone == undefined || that.data.userInfo.phone == null || that.data.userInfo.phone == "") {
      that.navbindphone();
    } else if (that.data.userInfo.senderFlag) {
      let sender = wx.getStorageSync("sender")
      if (sender != undefined && sender != null && sender != '') {
        wx.navigateTo({
          url: '/pages/mycount/mycount',
        })
      } else {
        app.getsender();
        that.navmyrunorder();
      }
    } else {
      app.showModel("提示", "检测到您还未认证跑腿人员或还在审核中，是否前去认证页？", function (res) {
        that.navrunvalidate();
      })
    }
  },
  navmyrunorder:function(){
    if (that.data.userInfo.phone == undefined || that.data.userInfo.phone == null || that.data.userInfo.phone == "" ){
      that.navbindphone();
    }else if (that.data.userInfo.senderFlag){
      let sender=wx.getStorageSync("sender")
      if(sender!=undefined&&sender!=null&&sender!=''){
        wx.navigateTo({
          url: '/pages/myrunorder/myrunorder',
        })
      }else{
        app.getsender();
        that.navmyrunorder();
      }
    }else{
      app.showModel("提示","检测到您还未认证跑腿人员或还在审核中，是否前去认证页？",function(res){
        that.navrunvalidate();
      })
    }
    
  },
  navmyorder:function(){
    if (that.data.userInfo.phone == undefined || that.data.userInfo.phone == null || that.data.userInfo.phone == "") {
      that.navbindphone();
    } else{
      wx.navigateTo({
        url: '/pages/myorder/myorder',
      })
    }
  },
  navrunvalidate:function(e){
    if (that.data.userInfo.phone == undefined || that.data.userInfo.phone == null || that.data.userInfo.phone == "" ){
      that.navbindphone();
    }else{
      wx.navigateTo({
        url: '/pages/runvalidate/runvalidate',
      })
    }
  },
  navbindphone:function(e){
    wx.navigateTo({
      url: '/pages/bindphone/bindphone',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    let school=wx.getStorageSync("school")
    that.setData({
      userInfo: app.globalData.userInfo,
      ip: app.ip,
      school: school
    })
    that.settitlecolor();
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
    let school = wx.getStorageSync("school")
    that.setData({
      userInfo: app.globalData.userInfo,
      ip: app.ip,
      school: school
    })
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