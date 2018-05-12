// pages/shop/shop.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 1,
    btntype: null,
    showCan: false,
    maskhidden: true,
    attributeIndex: null,
  },
  changeNumber(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 0) {
      if (that.data.number <= 1) {
        app.showFailToast('已到最少购买量', 2000);
      } else {
        that.setData({
          number: that.data.number - 1
        })
      }

    } else if (type == 1) {
      that.setData({
        number: that.data.number + 1
      })
    }
  },
  numberInput(e) {
    let number = e.detail.value;
    that.setData({
      number: number
    })
  },
  tempDu(e) {
    let btntype = e.currentTarget.dataset.type;
    that.setData({
      btntype: btntype,
      maskhidden: !that.data.maskhidden
    })
  },
  hiddenmask() {
    that.setData({
      maskhidden: true
    })
  },
  call: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  chooseType(e) {
    let sunwouId = e.currentTarget.dataset.sunwouid;
    let attributeIndex = e.currentTarget.dataset.attributeindex;
    that.setData({
      attributeIndex: attributeIndex,
      sunwouId: sunwouId,
    })
  },
  switchToCart(e) {
    wx.switchTab({
      url: "/pages/gouwuche/gouwuche",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  downOrder(e) {
    let attributeIndex = that.data.attributeIndex;
    let userInfo = app.globalData.userInfo;
    if (attributeIndex == null) {
      app.showFailToast('请选择规格', 2000);
    } else if (userInfo.phone == '' || userInfo.phone==undefined) {
      app.showModel('提示', '您还没有绑定手机，是否前往绑定？', function (res) {
        wx.navigateTo({
          url: '/pages/myphone/myphone',
        })
      })
    }else{
      wx.setStorageSync('commodityList', that.data.commodity);
      wx.navigateTo({
        url: '/pages/payfor/payfor?commodityId=' + that.data.commodity[0].sunwouId + "&attributeIndex=" + attributeIndex + "&number=" + that.data.number+"&shopcar=0",
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  addShopCar(e) {
    let attributeIndex = that.data.attributeIndex;
    let userId = app.globalData.userId;
    if (attributeIndex == null) {
      app.showFailToast('请选择规格', 2000);
    }else {
      app.post('shop/ordercommodityadd', {
        userId: userId,
        attributeIndex: attributeIndex,
        commodityId: that.data.commodity[0].sunwouId,
        number: that.data.number
      }, function (res) {
        console.info(res);
        app.showSuccessToast('加入购物车成功', 2000);
        that.hiddenmask();
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let id = options.id;
    app.post('shop/findcommodity', {
      appid: app.sunwouId,
      page: 1,
      size: app.pageSize,
      sunwouId: id
    }, function (res) {
      if (res.body != undefined && res.body.length > 0) {
        res.body[0].remark = JSON.parse(res.body[0].remark);
        res.body[0].image = JSON.parse(res.body[0].image)
        let min = res.body[0].attribute[0].price;
        let max = res.body[0].attribute[0].price;
        res.body[0].attribute.forEach(function (i, index) {
          i.disprice = (i.price * res.body[0].discount).toFixed(2);
          if (i.price > max) {
            max = i.price
          }
          if (i.price < min) {
            min = i.price
          }
        })
        res.body[0].min = min;
        res.body[0].max = max;
        res.body[0].dismin = (min * res.body[0].discount).toFixed(2);
        res.body[0].dismax = (max * res.body[0].discount).toFixed(2);
        that.setData({
          commodity: res.body
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})