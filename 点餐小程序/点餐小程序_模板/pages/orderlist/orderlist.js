var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0,
    list:[],
    load:false,
    payment:'',
    query: {
      fields: [],
      wheres: [
        {
          value: "userId",
          opertionType: "equal",
          opertionValue: wx.getStorageSync("app").sunwouId
        },
        
        {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        },
        {
          value: "type",
          opertionType: "ne",
          opertionValue: '充值'
        }
      ],
      sorts: [{ value: 'status', asc: false },{ value: 'createTime', asc: false }],
      pages: {
        currentPage: 1,
        size: 10
      }
    }
  },
  gotosOrder(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  previewOrder(e){
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders(0)
  },
 
  getOrders(num){
    this.setData({
      load:true
    })
    if(num == 0){
      this.data.query.pages.currentPage = 1
    }else{
      this.data.query.pages.currentPage += 1
    }
    var that = this;
    app.post('takeoutorder/find',{query:JSON.stringify(this.data.query)},function(res){
      if(res.code){
        var li = that.data.list
        if (num == 0) {
          li = res.params.list
        } else {
          for (var i in res.params.list){
            li.push(res.params.list[i])
          }
        }
        that.setData({
          load:false,
          list:li,
          total:res.params.total
        })
      }else{
        that.setData({
          load: false
        })
      }
    })
  },

  onPullDownRefresh: function () {
    this.getOrders(0)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.total > this.data.list){
      this.getOrders(1)
    }
  },
  paydo(e) {
    var that = this;
    wx.showModal({
      title: '支付方式',
      content: '请选择一个支付方式',
      confirmText:'会员支付',
      cancelText:'微信支付',
      success(res){
        if(res.confirm){
          that.setData({
            payment:'余额支付'
          })
          that.pay(e.currentTarget.dataset.id)
        }else{
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
  }

})