// pages/myorder/myorder.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist: []

  },
  cilckorderitem: function (e) {
    let sunwouId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mainorder/mainorder?sunwouId=' + sunwouId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  getorderlist: function (page) {
    let sender=wx.getStorageSync("sender");
    let query = {
      sorts: [
        { value: 'createTime', asc: false }
      ],
      wheres: [{
        value: "senderId", opertionType: "equal", opertionValue: sender.sunwouId
      }]
    }
    app.post("/order/find", { query: JSON.stringify(query) }, function (res) {
      if (res.code) {
        let orderlist = res.params.orders;
        orderlist.forEach(function (item, index) {
          app.timediffnow(item)
        })
        that.setData({
          orderlist: orderlist
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getorderlist()
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