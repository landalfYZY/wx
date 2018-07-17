
const app = getApp()
var com = require('../../utils/common.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getStyle:["自行取货","外卖配送","店内用餐"],
    flag:0,
    sum:0.0,
    address:'',
    couponIndex:-1,
    couponId:'',
    total:0,
    orsum:0,
    card:['使用次卡','不使用次卡'],
    cflag:0
  },
  cardChange(e){
    this.setData({
      cflag: e.detail.value
    })
  },
  navTo(e){
    com.wxNavgiteTo(e.currentTarget.dataset.navurl, ["flag","price"], e.currentTarget.dataset)
  },
  navTo2(e) {
    wx.navigateTo({
      url: '/pages/pay/address/address?list='+JSON.stringify(this.data.shop.range),
    })
  },
  bindPickerChange(e){
    this.setData({
      flag: e.detail.value
    })
    this.canhe()
    this.getTotal()
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      address: wx.getStorageSync("address") ? wx.getStorageSync("address"):'',
      shop:JSON.parse(options.shop),
      cart:JSON.parse(options.cart),
      sum:options.sum,
      reduce: options.reduce,
      orsum: options.sum
    })
    this.canhe();
    this.getCoupon();
    
  },
  canhe(){
    var boxPrice = parseFloat(this.data.shop.boxPrice);
    var sum      = parseFloat(this.data.orsum);
    var box      = 0;
    if(this.data.flag != 2){
      for (var i in this.data.cart) {
        if (this.data.cart[i].boxPrice) {
          box += boxPrice;
        }
      }
    }
    this.setData({
      sum : (sum + box).toFixed(1),
      box : box
    })
  },
  getCoupon() {
    com.getCoupon(null, function (res) {
      that.setData({
        coupon: res.params.msg
      })
      that.initCoupon();
    })
  },



  initCoupon(){
    var temp      = -1                 ;
    var reduceMax = 0                  ;
    var coupon    = this.data.coupon   ;
    var couponId  = this.data.couponId ;

    for( var i in coupon ){
      if( this.data.sum >= coupon[i].coupon.full ){
        if (this.data.sum >= coupon[i].coupon.reduce && coupon[i].coupon.reduce > reduceMax){
          reduceMax = coupon[i].coupon.reduce;
          couponId  = coupon[i].sunwouId;
          temp      = i;
        }
      }
    }

    this.setData({
      couponId: couponId,
      couponIndex : temp > -1 ? temp:-1
    })
    this.getTotal()
  },

  getTotal(){
    var total = 0;
    var sum   = parseFloat(this.data.sum);
    if (this.data.couponIndex > -1){
      if (this.data.coupon != '') {
        total = sum - this.data.coupon[this.data.couponIndex].coupon.reduce;
      }
    }else{
      total = sum
    }
    

    this.setData({
      total: total.toFixed(2)
    })
  },
  submitPay(e){
    console.log(e)
    var productIds = [];
    var numbers    = [];
    var attributes = [];
    var couponId   = this.data.couponId;
    var cart       = this.data.cart;
    var data       = {
      formid       : e.detail.formId,
      userId       : wx.getStorageSync("user").sunwouId,
      shopId       : this.data.shop.sunwouId,
      getType      : this.data.getStyle[this.data.flag],
      phone: this.data.address ? this.data.address.phone:'',
      address: this.data.address ? this.data.address.buildName + this.data.address.floor + '层' + ' ' + this.data.address.des : '',
      concatName: this.data.address ? this.data.address.realName : ''
    }
    if(couponId != ''){
      data.couponId = this.data.couponId;
    }

    for(var i in cart){
      productIds.push(cart[i].sunwouId);
      numbers.push(cart[i].num);
      var dp = '';
      if (cart[i].attributeCategorys.length == 0 || !cart[i].attributeCategorys){
        dp = "kong|"
      }else{
        for (var j in cart[i].attributeCategorys) {
          for (var k in cart[i].attributeCategorys[j].attributes) {
            if (cart[i].attributeCategorys[j].attributes[k].active) {
              dp += cart[i].attributeCategorys[j].attributes[k].sunwouId + '-'
            }
          }
        }
      }
      
      dp = dp.substring(0,dp.length-1)
      attributes.push(dp)
    }
    data.productIds = productIds.toString();
    data.numbers    = numbers.toString();
    data.attributes = attributes.toString();
    this.submit(data);
  },
  submit(data){
    wx.showLoading({
      title: '请稍等',
    })
    com.post('order/add',data,function(res){
      wx.hideLoading();

      if(res.code){
        com.pay(res.msg, '微信支付',"redirectTo")
      }
      
    })
  }
})