const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    loading: false,
    countPrice: 0,
    checkedAll: false,
    ip: null,
    shopCarList:[]
  },
  navToShop: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id,
    })
  },
  navToPayfor(e) {
    let userInfo = app.globalData.userInfo;
    if (userInfo.phone == '' || userInfo.phone == undefined) {
      app.showModel('提示', '您还没有绑定手机，是否前往绑定？', function (res) {
        wx.navigateTo({
          url: '/pages/myphone/myphone',
        })
      })
    }else{
      let shopCarList = that.data.shopCarList;
      let li = [];
      shopCarList.forEach(function (item, index) {
        if (item.active) {
          li.push(item)
        }
      })
      wx.setStorageSync('commodityList', li)
      wx.navigateTo({
        url: '/pages/payfor/payfor?shopcar=1',
      })
    }
  },
  deletes(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: function (res) {
        if (res.confirm) {
          app.post('shop/ordercommodityremove', {
            orderCommodityIds: [e.currentTarget.dataset.id]
          }, function (res) {
            if (res.code == 1000) {
              that.getShopCar();
            }
          })
        }
      }
    })
  },
  deletesSelect(e) {
    let shopCarList = that.data.shopCarList;
    let orderCommodityIds=[];
    if (shopCarList.length>0){
      shopCarList.forEach(function (item, index) {
        if (item.active == true){
          orderCommodityIds.push(item.sunwouId);
        }
      })
    }
    if (orderCommodityIds.length>0){
      wx.showModal({
        title: '提示',
        content: '确定要删除选中的商品？',
        success: function (res) {
          if (res.confirm) {
            app.post('shop/ordercommodityremove', {
              orderCommodityIds: orderCommodityIds
            }, function (res) {
              if (res.code == 1000) {
                that.getShopCar();
              }
            })
          }
        }
      })
    }else{
      app.showModel('提示',"您没有选中任何商品哦！！！");
    }
    
  },
  chooseIt(e) {
    that.data.shopCarList[e.currentTarget.dataset.index].active = !that.data.shopCarList[e.currentTarget.dataset.index].active;
    that.setData({
      shopCarList: that.data.shopCarList
    })
    that.count()
  },
  count() {
    let count = 0;
    let all = 0;
    let checkedAll = false;
    for (let item in that.data.shopCarList) {
      if (that.data.shopCarList[item].active) {
        count += that.data.shopCarList[item].totalPrice;
        all += 1;
      }
    }
    if (all == that.data.shopCarList.length) {
      checkedAll = true
    }
    that.setData({
      countPrice: count,
      checkedAll: checkedAll
    })
  },
  chooseAll() {
    let ca = false;
    if (that.data.checkedAll) {
      for (let item in that.data.shopCarList) {
        that.data.shopCarList[item].active = false;
      }
      ca = false;
    } else {
      for (let item in that.data.shopCarList) {
        that.data.shopCarList[item].active = true;
      }
      ca = true
    }
    that.count();
    that.setData({
      shopCarList: that.data.shopCarList,
      checkedAll: ca
    })
  },
  getShopCar(e){
    app.post("shop/myordercommodity", { userId: app.globalData.userId},function(res){
      res.body.forEach(function(item,index){
        item.active=false
      })
      that.setData({
        shopCarList:res.body
      })
      that.count()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    
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
    that.getShopCar();
  },

})