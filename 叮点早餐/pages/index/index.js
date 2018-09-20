var app = getApp();
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
    ],
    tom: '',
    autoplay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.setStorageSync('schoolId', "sunwou20180525094800369")
    app.globalData.school.sunwouId = "sunwou20180525094800369",
      that.swiper();
  },
  getDay() {
    var date = new Date();
    var str = (date.getMonth() + 1) + '.' + (date.getDate() + 1)
    var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var dy = '';
    var num = 0;
    switch (date.getDay()) {
      case 0: num += 1; break;
      case 1: num += 7; break;
      case 2: num += 6; break;
      case 3: num += 5; break;
      case 4: num += 4; break;
      case 5: num += 3; break;
      case 6: num += 2; break;
    }
    dy = (date.getMonth() + 1) + '.'
    this.setData({
      tom: str,
      dy: dy
    })
  },
  navtotime() {
    if (wx.getStorageSync("time")) {
      wx.navigateTo({
        url: '/pages/menu/menu?id=e7cb0-20180711102529855',
      })
    } else {
      wx.navigateTo({
        url: '/pages/set/set',
      })
    }
  },
  swiper: function () {
    var query = {
      wheres: [{
        value: "isDelete",
        opertionType: "equal",
        opertionValue: false
      },],
      fields: []
    };
    app.post('/carousel/find', {
      query: JSON.stringify(query), veision: 5
    }, function (res) {
      if (res.data.code) {
        that.setData({
          imgUrls: res.data.params.carousels
        })
      } else {

      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync("time")) {
      this.getDay()
      this.setData({
        time: wx.getStorageSync("time"),
        hol: wx.getStorageSync("hol")
      })
    }
    this.setData({
      autoplay: true
    })
  },

 
  onHide: function () {
    that.setData({
      autoplay: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})