var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getStyle:["堂食","外带","外送"],
    shopName: '',
    shopId: '',
    carts: [],
    flag:0,
    bz:'',
    payment:'余额支付'
  },
  changePay(e){
    this.setData({
      payment:e.currentTarget.dataset.sty
    })
  },
  bzInput(e){
    this.setData({
      bz:e.detail.value
    })
  },
  bindPickerChange(e){
    var that = this
    var num = e.detail.value
    var boxP = 0
    if(e.detail.value == 2){
      wx.showToast({
        title: '暂不支持外送',
        icon:'none'
      })
      num = 0
    }
    if (e.detail.value == 1){
      boxP = this.data.box*this.data.count
    }
    this.setData({
      flag:num,
      boxP:boxP,
      sum: (parseFloat(boxP) + parseFloat(that.data.sum)).toFixed(2)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      count:options.count,
      sum:options.sum,
      shopName: options.shopName,
      shopId: options.shopId,
      carts: JSON.parse(options.carts),
      box:options.box
    })
    this.initData();
  },
  initData(){
    var carts = this.data.carts
    var li = [];
    for(var i in carts){
      var temp = { productId: carts[i].sunwouId, count: carts[i].count, opt: [] }
      for(var j in carts[i].attr){
        for(var k in carts[i].attr[j].value){
          if (carts[i].attr[j].value[k].active){
            temp.opt.push(k);
            break;
          }
        }
      }
      li.push(temp)
    }
    this.setData({
      initCart:li
    })
  },
  submitOrder(e){
    var formId = e.detail.formId;
    
    var that = this;
    if (that.data.payment == '余额支付'){
      wx.showModal({
        title: '提示',
        content: '您选择的是余额支付请确认',
        success(res){
          if(res.confirm){
            
            that.orderAdd()
          }
        }
      })
    }else{
      that.orderAdd()
    }
    
  },
  orderAdd(){
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    app.post('takeoutorder/add', {
      appid: app.id,
      shopId: this.data.shopId,
      userId: wx.getStorageSync("app").sunwouId,
      type: this.data.getStyle[this.data.flag],
      bz: this.data.bz,
      opp: JSON.stringify(this.data.initCart)
    }, function (res) {
      wx.hideLoading()
      if (res.code) {
        var oid = res.msg
        that.pay(oid)
      }
    })
  },
  pay(id){
    var that = this
    app.post('takeoutorder/pay', { id: id, payment: this.data.payment }, function (res) {
      if (that.data.payment=='余额支付'){
        if(res.code){
          wx.showToast({
            title: '支付成功',
          })
          wx.redirectTo({
            url: '/pages/orderDetail/orderDetail?id=' + id,
          })
        }else{
          wx.showModal({
            title: '余额不足',
            content: '是否使用微信支付?',
            success(res){
              if(res.confirm){
                that.setData({
                  payment:'微信支付'
                })
                that.pay(id)
              }else{
                wx.redirectTo({
                  url: '/pages/orderDetail/orderDetail?id=' + id,
                })
              }
            }
          })
        }
        
      }else{
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