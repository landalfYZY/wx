// pages/mine/mine.js
var app = getApp();

var that;

Page({

  config: {
    usingComponents: {
      'wxc-list': '@minui/wxc-list',
      'wxc-icon': '@minui/wxc-icon'
    }
  },
  data: {
    touxiangsrc:'',
    list: [
      {
        title: '关联学生',
        desc: '0',
        slot: false,
        src: '/images/q1.png',
        bind: 'click'
      }, {
      title: '缴费记录',
      desc: '0',
      slot: false,
      src: '/images/q2.png',
      bind: 'click2'
    }, {
      title: '缴费须知',
      icolor: "#69A0DD",
      src: '/images/q3.png'
    },{
      title: '客服与帮助',
      src: '/images/q4.png'
    },],
  },
  /**
   * 生命周期函数--监听页面加载
   */

  click:function(){
    wx.navigateTo({
      url: '/pages/mine/gaunlian/guanlian',
    })
  },

  click2: function () {
    wx.navigateTo({
      url: '/pages/mine/jilu/jilu',
    })
  },
  onLoad: function (options) {
   that =this
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
    if (wx.getStorageSync("user")) {
      this.setData({
        touxiang: true,
        touxiangsrc: wx.getStorageSync("user").msg.avatarUrl
      })
    }else{
      this.setData({
        touxiang: false,
        touxiangsrc: 'http://img.zcool.cn/community/016a1955ed02cc32f875a13291fb8b.png'
      })
    }
    app.post('/user/findbind', { wxUserId: wx.getStorageSync("user").msg.sunwouId, }, function (res) {
      if (res.data.params.msg.length != 0) {
        that.data.list[0].desc = res.data.params.msg.length
        that.setData({
          list: that.data.list
        })
      }else{
        that.data.list[0].desc = 0
        that.setData({
          list: that.data.list
        })
      }
    })
  },

  saveNewAdres: function (e) {
    //新建联系人信息
      //更新传回去给服务器
      app.post('/wxuser/regist', { avatarUrl: e.detail.userInfo ? e.detail.userInfo.avatarUrl : '', nickName: e.detail.userInfo ? e.detail.userInfo.nickName : '',sunwouId: wx.getStorageSync("user").msg.sunwouId, gender: e.detail.userInfo ? e.detail.userInfo.gender : '', city: e.detail.userInfo ? e.detail.userInfo.city : '', province: e.detail.userInfo ? e.detail.userInfo.province : '' }, function (res) {
        if (res.data.code) {
          //成功
          wx.setStorageSync('user', res.data.params)
          that.setData({
            touxiang: true,
            touxiangsrc: wx.getStorageSync("user").msg.avatarUrl
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