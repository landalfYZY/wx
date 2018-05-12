var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  makePhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.msg.shop.shopPhone,
    })
  },
  redtoshop(){
    wx.redirectTo({
      url: '/pages/list/list?id=' + this.data.msg.shop.sunwouId + '&shopName=' + this.data.msg.shop.shopName,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getOrder(options.id)
  },
  getOrder(id){
    wx.showNavigationBarLoading()
    var that = this;
    app.post('takeoutorder/find',{
      query: JSON.stringify({
        fields: [],
        wheres: [
          {
            value: "sunwouId",
            opertionType: "equal",
            opertionValue: id
          }
        ],
        sorts: [{ value: 'createTime', asc: false }],
        pages: {
          currentPage: 1,
          size: 1
        }
      })
    },function(res){
      wx.hideNavigationBarLoading()
      if(res.code){
        that.setData({
          msg:res.params.list[0]
        })
      }else{
        
      }
    })
  },
  paydo(e) {
    var that = this;
    wx.showModal({
      title: '支付方式',
      content: '请选择一个支付方式',
      confirmText: '会员支付',
      cancelText: '微信支付',
      success(res) {
        if (res.confirm) {
          that.setData({
            payment: '余额支付'
          })
          that.pay(e.currentTarget.dataset.id)
        } else {
          that.setData({
            payment: '微信支付'
          })
          that.pay(e.currentTarget.dataset.id)
        }
      }
    })
  },
  pay(id) {
    var that = this
    app.post('takeoutorder/pay', { id: id, payment: this.data.payment }, function (res) {
      if (that.data.payment == '余额支付') {
        if (res.code) {
          wx.showToast({
            title: '支付成功',
          })
          wx.redirectTo({
            url: '/pages/orderDetail/orderDetail?id=' + id,
          })
        } else {
          wx.showModal({
            title: '余额不足',
            content: '是否使用微信支付?',
            success(res) {
              if (res.confirm) {
                that.setData({
                  payment: '微信支付'
                })
                that.pay(id)
              } else {
                wx.redirectTo({
                  url: '/pages/orderDetail/orderDetail?id=' + id,
                })
              }
            }
          })
        }

      } else {
        if (res.code) {
          var pay = JSON.parse(res.params.res);
          wx.requestPayment({
            'timeStamp': pay.time,
            'nonceStr': pay.nonceStr,
            'package': 'prepay_id=' + pay.prepay_id,
            'signType': 'MD5',
            'paySign': pay.paySign,
            'success': function (res) {
              wx.redirectTo({
                url: '/pages/orderDetail/orderDetail?id=' + id,
              })
            },
            'fail': function (res) {
              wx.redirectTo({
                url: '/pages/orderDetail/orderDetail?id=' + id,
              })
            }
          })
        }
      }

    })
  },
 
})