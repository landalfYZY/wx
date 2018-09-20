var app = getApp();
var that;

Page({

  data: {
    getpspl1: '',
    getsjpl1: '',
    star: 0,
    show1: true,
    show2: true,
    starMap: [
      '非常差',
      '差',
      '一般',
      '好',
      '非常好',
    ],
    star2: 0,
    starMap2: [
      '非常差',
      '差',
      '一般',
      '好',
      '非常好',
    ],
  },

  onLoad: function (options) {
    that = this;
    var id = options.orderid;
    var query = {
      wheres: [{ value: "sunwouId", opertionType: "equal", opertionValue: id }],
      fields: ['shopId', 'shopName', 'shopImage', 'senderId', 'senderName', 'senderImage'],
    }
    //查询订单
    app.post('/order/find', { query: JSON.stringify(query) }, function (res) {
      if (res.data.code) {
        //成功 
        if (!res.data.params.orders[0].senderId) {
          that.setData({
            show1: false
          })
        } else if (!res.data.params.orders[0].shopId) {
          that.setData({
            show2: false
          })
        }
        that.setData({
          order: res.data.params.orders[0]
        })
      }
    })
  },

  // 获取配送员评论
  getpspl: function (e) {
    that.setData({
      getpspl1: e.detail.value
    })
  },

  // 获取商家评论
  getsjpl: function (e) {
    that.setData({
      getsjpl1: e.detail.value
    })
  },

  //选择星星给配送员
  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },

  //选择星星给商家
  myStarChoose2(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star2: star,
    });
  },

  // 确认评论
  reallyConment: function (e) {
    if (that.data.show2 == false) {
      if (that.data.star == 0 || that.data.getpspl1 == "") {
        wx.showToast({
          title: "请填写完整评论",
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
      } else {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        app.post('/evaluate/add', { orderId: that.data.order.sunwouId, senderId: that.data.order.senderId, userId: app.globalData.user.sunwouId, schoolId: app.globalData.school.sunwouId, senderNumber: that.data.star * 2, senderDes: that.data.getpspl1 }, function (res) {
          if (res.data.code) {
            //成功
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon: '/images/success.png',
              duration: 2000,
              mask: true
            })
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
          }
        })
      }
    } else if (that.data.show1 == false) {
      if (that.data.star2 == 0 || that.data.getsjpl1 == "") {
        wx.showToast({
          title: "请填写完整评论",
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
      } else {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        app.post('/evaluate/add', { orderId: that.data.order.sunwouId, shopId: that.data.order.shopId, userId: app.globalData.user.sunwouId, schoolId: app.globalData.school.sunwouId, shopNumber: that.data.star2 * 2, shopDes: that.data.getsjpl1 }, function (res) {
          if (res.data.code) {
            //成功
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon: '/images/success.png',
              duration: 2000,
              mask: true
            })
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
          }
        })
      }
    } else {
      if (that.data.star2 == 0 || that.data.star == 0 || that.data.getsjpl1 == "" || that.data.getpspl1 == "") {
        wx.showToast({
          title: "请填写完整评论",
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
      } else {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        app.post('/evaluate/add', { orderId: that.data.order.sunwouId, senderId: that.data.order.senderId, shopId: that.data.order.shopId, userId: app.globalData.user.sunwouId, schoolId: app.globalData.school.sunwouId, senderNumber: that.data.star * 2, shopNumber: that.data.star2 * 2, shopDes: that.data.getsjpl1, senderDes: that.data.getpspl1 }, function (res) {
          if (res.data.code) {
            //成功
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon: '/images/success.png',
              duration: 2000,
              mask: true
            })
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
          }
        })
      }
    }

  },
  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },
  
})