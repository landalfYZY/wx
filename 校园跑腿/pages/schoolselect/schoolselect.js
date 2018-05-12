// pages/schoolselect/schoolselect.js
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schools:[],
  },
  getschool: function (e) {
    let query = { fields: ["schoolName"]};
    app.post("/school/find",{query:JSON.stringify(query)} ,function(res){
      if(res.code){
        that.setData({
          schools:res.params.schools
        })
      }
    })
  },
  cilckschool:function(e){
    console.info(e)
    let index = e.currentTarget.dataset.index;
    let school=that.data.schools[index];
    wx.setStorageSync("school", school);
    wx.navigateTo({
      url: '/pages/floorselect/floorselect?schoolId=' + school.sunwouId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getschool()
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