// pages/other1/other1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeFlag: 2,
    times: [
      { time: '上午 07:00', value: '07:00 AM' },
      { time: '上午 07:30', value: '07:30 AM' },
      { time: '上午 08:00', value: '08:00 AM' },
      { time: '上午 08:30', value: '08:30 AM' },
      { time: '上午 09:00', value: '09:00 AM' },
      { time: '上午 09:30', value: '09:30 AM' },
      { time: '上午 10:00', value: '10:00 AM' },
    ],
    holFlag: 2,
    hol: [
      { label: '无休' },
      { label: '单休' },
      { label: '双休' },

    ]
  },
  changeTime(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      timeFlag: index
    })
  },
  changeHol(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      holFlag: index
    })
  },
  save() {
    wx.setStorageSync("time", this.data.times[this.data.timeFlag].value);
    wx.setStorageSync("hol", this.data.hol[this.data.holFlag].label);

    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


})