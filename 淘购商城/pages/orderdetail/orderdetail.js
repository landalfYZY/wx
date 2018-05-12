const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxnumber:'',
    orderId:null,
    order:null,
    ip:null,
    version:null
  },
  pay() {
    app.post('shop/orderpayrequest ', {
      orderId: that.data.order.sunwouId
    }, function (res) {
      that.wxpay(res.body)
    })
  },
  //收货
  receive(){
    wx.showModal({
      title: '提示',
      content: '请确认货已到',
      success(res) {
        if(res.confirm){
          app.post('shop/orderupdatestatus', {
            orderId: that.data.order.sunwouId,
            status: 4
          }, function (res) {
            if (res.code == 1000) {
              wx.redirectTo({
                url: '/pages/orderdetail/orderdetail?id=' + that.data.order.orderId,
              })
            }else{
              app.showFailToast('支付失败', 1000);
            }
          })
        }
      }
    })
    
  },
  //微信支付
  wxpay: function (data) {
    wx.requestPayment({
      timeStamp: data.time,
      nonceStr: data.nonceStr,
      package: 'prepay_id=' + data.prepay_id,
      signType: 'MD5',
      paySign: data.paySign,
      success: function () {
        wx.redirectTo({
          url: '/pages/orderdetail/orderdetail?id=' + that.data.order.sunwouId,
        })
      },
      fail: function () {
        app.showFailToast('支付失败',1000);
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      orderId:options.id
    })
    that.getOrder();
  },
  // getLogistic(){
  //   if (that.data.order.logisticsTag != null){
  //     app.post('logistics/info/wx/findInfo', {
  //       logisticsTag: that.data.order.logisticsTag,
  //       companyCode: that.data.order.companyCode
  //     },function(res){
  //       var time = JSON.parse(res.body);
  //       time.Traces = JSON.parse(res.body).Traces.reverse()
  //       that.setData({
  //         logistics: time
  //       })
  //     })
  //   }
  // },
  getOrder(){
    app.post('shop/findorder',{
      sunwouId:that.data.orderId
    },function(res){
      that.setData({
        order:res.body[0]
      })
      // that.getLogistic();
    })
  },
  navToShop(e){
    wx.navigateTo({
      url: '/pages/shop/shop?id=' +e.currentTarget.dataset.id,
    })
  },
  //生成订单信息
  // exist(){
  //   wx.navigateTo({
  //     url: '/pages/existorder/existorder?order='+JSON.stringify(that.data.order),
  //   })
  // },
  takeTojq(e){
    wx.setClipboardData({
      data: app.wxnumber,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '已添加到剪切板',
            })
          }
        })
      }
    })
  },
})