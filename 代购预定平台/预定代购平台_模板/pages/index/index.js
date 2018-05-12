//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    carCurrent:0,
    hots:[
      {url:'/img/g4.jpg'},
      { url: '/img/g5.jpg' },
      {url: '/img/g6.jpg' }
    ],
    rm:[
      { url: '/img/g1.png' },
      { url: '/img/g2.jpg' },
      { url: '/img/g3.jpg' }
    ]
  },
  currentChange(e){
    this.setData({
      carCurrent:e.detail.current
    })
  },
  navToDetail(){
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width:res.screenWidth
        })
      },
    })
  },

})
