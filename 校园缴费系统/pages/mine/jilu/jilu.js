var app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    listorders:[]
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
    if (wx.getStorageSync("user")) {
      that.huoqu(wx.getStorageSync("user").msg.sunwouId)
    } else {
      app.getuser(function (res) {
        that.huoqu(res.data.params.msg.sunwouId)
      })
    }
  },
  huoqu: function (id) {
    app.post('/user/findbind', { wxUserId: id }, function (res) {
      if (res.data.code) {
        that.setData({
          list: res.data.params.msg
        })
        var query = {
          wheres: [{ value: "wxuserId", opertionType: "equal", opertionValue: wx.getStorageSync("user").msg.sunwouId }, { value: 'status', opertionType: 'ne', opertionValue: '待缴费' },],
          pages: { currentPage: 1, size: 5 },
        }
        app.post('/order/find', { query: JSON.stringify(query) }, function (res) {
          if (res.data.code) {
            //成功
            that.setData({
              listorders: res.data.params.msg,
            })
          }
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