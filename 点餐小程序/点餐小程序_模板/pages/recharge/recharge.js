var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    re:[
      { price: 50, ss: 10 }, { price: 100, ss: 20 }, { price: 150, ss: 30 }, { price: 200, ss: 50 }, { price: 300, ss: 70 },
      {price: 400, ss: 100 },{price: 500, ss: 120 },{price: 700, ss: 160 },{price: 1000, ss: 250 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          bk:wx.getStorageSync("bk"),
          width:res.windowWidth
        })
      },
    })
    this.getRecharge()
  },
  getRecharge(){
    var that = this;
    app.post('charge/find',{
      query: JSON.stringify({
        fields: [],
        wheres: [
          {
            value: "appid",
            opertionType: "equal",
            opertionValue: app.id
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }
        ],
        sorts: [
          { value: "createTime", asc: true }
        ],
        pages: {
          currentPage: 1,
          size: 100
        }
      })
    },function(res){
      if(res.code){
        that.setData({
          list:res.params.list
        })
      }
    })
  },
  rechage(e){
    var that = this;
    app.post('takeoutorder/charge',{
      appid:app.id,
      userId:wx.getStorageSync("app").sunwouId,
      type:'充值',
      total:e.currentTarget.dataset.pri
    },function(res){
      var pay = JSON.parse(res.params.res);
      if(res.code){
        wx.requestPayment({
          'timeStamp': pay.time,
          'nonceStr': pay.nonceStr,
          'package': 'prepay_id=' + pay.prepay_id,
          'signType': 'MD5',
          'paySign': pay.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '/pages/vip/vip',
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '/pages/vip/vip',
            })
          }
        })
      }
    })
  },

})