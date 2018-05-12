// pages/mainorder/mainorder.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{}
  },
  payorder: function (e) {
    app.post("/order/pay", { sunwouId: that.data.order.sunwouId, payment: "wx" }, function (res) {
      console.info(res)
      if (res.code) {
        that.wxpay(res.params.msg)
      } else {
        app.showFailToast(res.msg, 2000);
      }
    })
  },
  wxpay: function (data) {
    console.info(data)
    wx.requestPayment({
      'timeStamp': data.time,
      'nonceStr': data.nonceStr,
      'package': 'prepay_id=' + data.prepay_id,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        that.getorderlist(that.data.order.sunwouId);
        
      },
      'fail': function (res) {
        console.info(res)
        app.showFailToast(res.msg,2000);

      },

    })
  },
  cancelorder:function(e){
    app.post("/order/cancel", { orderId: that.data.order.sunwouId},function(res){
      that.getorderlist(that.data.order.sunwouId);
    })
  },
  finshorder:function(e){
    app.post("/sender/finshorder", { orderId: that.data.order.sunwouId},function(res){
      that.getorderlist(that.data.order.sunwouId);
    })
  },
  getorderlist: function (sunwouId) {
    let query = {
      wheres: [ {
        value: "type", opertionType: "equal", opertionValue: "跑腿订单"
      }, {
        value: "sunwouId", opertionType: "equal", opertionValue: sunwouId
      }]
    }
    app.post("/order/find", { query: JSON.stringify(query) }, function (res) {
      if (res.code) {
        let orderlist = res.params.orders;
        // orderlist.forEach(function (item, index) {
        //   that.timediffnow(item)
        // })
        that.setData({
          order: res.params.orders[0]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let sunwouId = options.sunwouId;
    that.getorderlist(sunwouId);
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
      path: '/pages/orderscan/orderscan?sunwouId='+that.data.order.sunwouId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})