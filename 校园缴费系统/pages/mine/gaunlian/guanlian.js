var app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */  config: {
    usingComponents: {
      'wxc-abnor': '@minui/wxc-abnor',
    }
  },
  data: {
    showdetail: false,
    guanlian: false,
    zhengjian: '',
    list:[]
  },
  // 关联按钮
  guanlian: function () {
    this.setData({
      showdetail: true,
      guanlian: true,
    })
  },
  //联系人
  zhengjian: function (e) {
    that.data.zhengjian = e.detail.value
  },
  //登陆按钮
  queding: function () {
    app.post('/user/bind', { wxUserId: wx.getStorageSync("user").msg.sunwouId, no: that.data.zhengjian }, function (res) {
      if (res.data.code) {
        //成功
        wx.showToast({
          title: res.data.msg,
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
        app.post('/user/findbind', { wxUserId: wx.getStorageSync("user").msg.sunwouId, }, function (res) {
          if (res.data.params.msg.length != 0) {
            that.setData({
              guanlian: true,
              list: res.data.params.msg,
              showdetail: false,
              zhengjian: ''
            })
          }
        })
      } else if (res.data.msg == "已经关联") {
        wx.showToast({
          title: '已经关联过了',
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
        that.setData({
          guanlian: true,
          showdetail: false,
          zhengjian: ''
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  that=this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  quguan: function(e){
    app.post('/user/cancelbind', { wxUserId: wx.getStorageSync("user").msg.sunwouId,no: e.currentTarget.dataset.id }, function (res) {
      if (res.data.code) {
        wx.showToast({
          title: res.data.msg,
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
        app.post('/user/findbind', { wxUserId: wx.getStorageSync("user").msg.sunwouId, }, function (res) {
          if (res.data.params.msg.length != 0) {
            that.setData({
              guanlian: true,
              list: res.data.params.msg,
              showdetail: false
            })
          }else{
            that.setData({
              guanlian: false,
              list: res.data.params.msg,
              showdetail: false
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.post('/user/findbind', { wxUserId: wx.getStorageSync("user").msg.sunwouId, }, function (res) {
      if (res.data.params.msg.length != 0) {
        that.setData({
          guanlian: true,
          list: res.data.params.msg,
          showdetail: false
        })
      }
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
  
  }
})