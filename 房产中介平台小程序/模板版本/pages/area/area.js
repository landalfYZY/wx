var china = require('../../utils/area.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot:['杭州市','上海市','北京市','深圳市','天津市','重庆市'],
    china:[],
    searchText:'',
    searchList:[]
  },
  chooseCity(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]
    wx.setStorageSync('city', e.currentTarget.dataset.name)
    prevPage.setData({
      cityText:e.currentTarget.dataset.name,
      loadAgent:true
    })
    wx.navigateBack({
      delta:1
    })
  },

  searchInput(e){
    var li = china.searchCity(e.detail.value)
    
    this.setData({
      searchList:li,
      searchText:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      china:china.getChina()
    })
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