const app = getApp();
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version:1,
    titleBar: [{ label: '全部', active: true }, { label: '待付款', active: false }, { label: '待发货', active: false }, { label: '待收货', active: false }, { label: '完成', active: false }],
    tempTitleBarIndex:0,
    page:0,
    orderType:0,
    list:[],
    haveMore:false
  },
  //收货
  receive(e) {
    wx.showModal({
      title: '提示',
      content: '请确认货已到',
      success(res) {
        if (res.confirm) {
          app.post('shop/orderupdatestatus', {
            orderId: e.currentTarget.dataset.id,
            status: 4
          }, function (res) {
            if (res.code == 1000) {
              wx.redirectTo({
                url: '/pages/orderdetail/orderdetail?id=' +e.currentTarget.dataset.id,
              })
            } else {
              wx.showToast({
                title: '操作失败',
                image: '/images/fail.png',
                duration: 1000
              })
            }
          })
        }
      }
    })

  },
  pay(e) {
    app.post('shop/orderpayrequest ', {
      orderId: e.currentTarget.dataset.id
    }, function (res) {
      that.wxpay(res.body, e.currentTarget.dataset.id)
    })
  },
  //微信支付
  wxpay: function (data,orderId) {
    wx.requestPayment({
      timeStamp: data.time,
      nonceStr: data.nonceStr,
      package: 'prepay_id=' + data.prepay_id,
      signType: 'MD5',
      paySign: data.paySign,
      success: function () {
        wx.redirectTo({
          url: '/pages/orderdetail/orderdetail?id=' + orderId,
        })
      },
      fail: function () {
        app.showFailToast("支付失败",1200);
      },

    })
  },
  navToOrderDetail(e){
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?id='+e.currentTarget.dataset.id,
    })
  },
  initTitleBar(){
    for(var item in that.data.titleBar){
      that.data.titleBar[item].active = false;
    }
  },
  changeBar(e){
    that.initTitleBar();
    that.data.titleBar[e.currentTarget.dataset.index].active = true;
    

    that.setData({
      orderType: e.currentTarget.dataset.index,
      titleBar:that.data.titleBar,
    })
    that.filter(1);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.filter(1);
  },

  /**
   * 获取订单列表
   */
  filter(page){
  let data = {
    userId: app.globalData.userId,
    page: page,
    size: app.pageSize,
  }
  if (that.data.orderType!=0){
    data.status = that.data.orderType
  }
  app.post('shop/findorder', data, function (res) {
    console.info(res);
      if (res.code == 1000 && res.body != null && res.body != undefined) {
        let haveMore = (res.body.length >= app.pageSize ? true : false);
        if (page == 1) {
          that.setData({
            list: res.body,
            haveMore: haveMore,
            page: page
          })
        } else {
          that.setData({
            list: that.data.list.concat(res.body),
            haveMore: haveMore,
            page: page
          })
        }

      } else {
        that.setData({
          list: []
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (that.data.haveMore){
      that.filter(that.data.page + 1)
    }
  },

})