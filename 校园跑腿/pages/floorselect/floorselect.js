let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floors: [],
  },
  getfloor: function (schoolId) {
    let query = { fields: ["name"], wheres: [{ value: 'isDelete', opertionType: 'equal', opertionValue: false }, { value: 'schoolId', opertionType: 'equal', opertionValue: schoolId }] };
    app.post("/floor/find", { query: JSON.stringify(query) }, function (res) {
      if (res.code) {
        that.setData({
          floors: res.params.floors
        })
      }
    })
  },
  cilckfloor: function (e) {
    console.info(e)
    let index = e.currentTarget.dataset.index;
    let floor = that.data.floors[index];
    wx.setStorageSync("floor", floor);
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.info(options)
    let schoolId=options.schoolId;
    that.getfloor(schoolId)
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