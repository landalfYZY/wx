const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxnumber:'',
    version:1,
    store:null,
    wxAddressInfo:'',
    templatePrice:0,
    countPrice:0,
    countNumber:0,
    orderRemark: '',
    commodityList:[],
    multiData:{
      
      itemIds : '',
    },
    companyShow:'',
    company:[],
    sum:0
  },

  addShopCar(success){
    let attributeIndex = that.data.shopcarInfo.attributeIndex;
    let userId = app.globalData.userId;
    let commodityId = that.data.shopcarInfo.commodityId;
    app.post('shop/ordercommodityadd', {
      userId: userId,
      attributeIndex: attributeIndex,
      commodityId: commodityId,
      number: that.data.shopcarInfo.number
    }, function (res) {
      success(res);
    })
  },

  payIt(){
    let isShopCar = that.data.shopcarInfo.shopcar;
    if (isShopCar==0){
     
      that.addShopCar(function (res) {
        let data = {
          appid: app.sunwouId,
          userId: app.globalData.userId,
          addressProvince: that.data.wxAddressInfo.provinceName,
          addressCity: that.data.wxAddressInfo.cityName,
          addressArea: that.data.wxAddressInfo.countyName,
          addressDetail: that.data.wxAddressInfo.detailInfo,
          concatPeople: that.data.wxAddressInfo.userName,
          concatPhone: that.data.wxAddressInfo.telNumber,
          clientName: 'wx',
          orderCommodityId: [res.result],
          numbers: [that.data.shopcarInfo.number],
          remark: that.data.orderRemark
        }
        that.createOrder(data)
      });
    
    }else{
      let orderCommodityIds=[];
      let numbers=[];
      let commodityList = that.data.commodityList;
      commodityList.forEach(function(item,index){
        orderCommodityIds.push(item.sunwouId);
        numbers.push(item.number);
      })
      let data = {
        appid: app.sunwouId,
        userId: app.globalData.userId,
        addressProvince: that.data.wxAddressInfo.provinceName,
        addressCity: that.data.wxAddressInfo.cityName,
        addressArea: that.data.wxAddressInfo.countyName,
        addressDetail: that.data.wxAddressInfo.detailInfo,
        concatPeople: that.data.wxAddressInfo.userName,
        concatPhone: that.data.wxAddressInfo.telNumber,
        clientName: 'wx',
        orderCommodityId: orderCommodityIds,
        numbers: numbers,
        remark: that.data.orderRemark
      }
      that.createOrder(data);
    }
    
  },
  //创建订单
  createOrder(data){
      app.post('shop/orderadd', data, function (res) {
        if(res.code==1000){
          let orderId = res.body;
          app.post("shop/orderpayrequest", { orderId: orderId }, function (res) {
            that.wxpay(res.body, orderId);
          })
        }else{
          app.showFailToast(res.result,1200);
        }
        
      })
  },
  //微信支付
  wxpay: function (data, orderId) {
    console.info(data)
    wx.requestPayment({
      'timeStamp': data.time,
      'nonceStr': data.nonceStr,
      'package': 'prepay_id=' + data.prepay_id,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        console.info(res);
        wx.redirectTo({
          url: '/pages/orderdetail/orderdetail?id=' + orderId,
        })
      },
      'fail': function (res) {
        console.info(res);
        wx.redirectTo({
          url: '/pages/orderdetail/orderdetail?id=' + orderId,
        })
      },

    })
  },
  //备注
  remarkInput(e){
    this.setData({
      orderRemark:e.detail.value
    })
  },

  count() {
    var count = 0;
    var countNumber = 0;
    let commodityList = that.data.commodityList;
    commodityList.forEach(function(item,index){
      count += item.totalPrice;
      countNumber += item.number
    })

    this.setData({
      countPrice: count,
      countNumber: countNumber
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * paytype    2为购物车结算    1为立即结算
   */
  onLoad: function (options) {
    that=this;
    let commodityList = wx.getStorageSync('commodityList');
    wx.removeStorageSync('commodityList');
    that.setData({
      commodityList: commodityList,
      shopcarInfo: options
    })
    if(options.shopcar==1){
      that.count();
    }
    

  },
  //选择地址
  chooseAddress(e){
    wx.chooseAddress({
      success(res) {
        console.info(res);
        that.setData({
          wxAddressInfo: res,
        })
      },
      fail(){
        wx.showModal({
          title: '提示',
          content: '为了您的方面请先开启微信地址授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function () {
                  that.chooseAddress(e)
                }
              })
            }
          }
        })
      }
    })
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


})