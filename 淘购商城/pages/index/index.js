//index.js
//获取应用实例
const app = getApp()
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Images: [],
    swiperCurrent: 0,
    index_item: [
      {
        'img': '/images/index/jiujiu.png',
        'text': '聚划算',
        'url': '/pages/takeaway/takeaway'
      },
      {
        'img': '/images/index/hunqing.png',
        'text': '婚庆用品',
        'url': '/pages/drinking/drinking'
      },

      {
        'img': '/images/index/lipin.png',
        'text': '礼品套餐',
        'url': '/pages/fruit/fruit'
      },
      {
        'img': '/images/index/qiandao.png',
        'text': '每日签到',
        'url': '/pages/snack/snack'
      },
    ],
    page: 1,
    list: [],
    haveMore: false
  },
  navToSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  navToShop: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id,
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  item: function (e) {
    let that = this;
    let ThisIndex = e.currentTarget.id;
    let index = parseInt(ThisIndex) + 1;
    if (ThisIndex < 3) {
      wx.navigateTo({
        url: '/pages/item/item?index=' + (index)
      })
    } else if (ThisIndex == 3) {
      app.post('user/sign', { userId: app.globalData.userId },
        function (res) {
          console.info(res);
          app.showModel('提示', res.result);
          if (res.code == 1000) {
            app.post('user/source', { type: 1, number: 2, userId: app.globalData.userId }, function (res) {
              console.info(res);
            })
          }
        })
    }
  },
  findImage: function () {
    app.post('shop/findimageandtext', {type:1}, function (res) {
      that.setData({
        Images: res.body
      })
    })
  },
  findHotCommodity: function (page) {
    app.post("shop/findcommodity", {
      page: page,
      showFlag: true,
      size: app.pageSize,
      appid: app.sunwouId,
    }, function (res) {
      let haveMore;
      if(res.body==undefined){
        haveMore=false;
      }else{
        res.body.forEach(function (item, index) {
          item.image = JSON.parse(item.image);
          item.remark = JSON.parse(item.remark);
          if (item.attribute != null && item.attribute != undefined && item.attribute.length > 0) {
            let min = item.attribute[0].price;
            let max = item.attribute[0].price;
            item.attribute.forEach(function (i, index) {
              if (i.price > max) {
                max = i.price
              }
              if (i.price < min) {
                min = i.price
              }
            })
            item.dismin = (min * item.discount).toFixed(2);
            item.dismax = (max * item.discount).toFixed(2);
            item.min = min;
            item.max = max;
          }
        })
        haveMore = (res.body.length >= app.pageSize ? true : false);
      }
      if (page == 1) {
        that.setData({
          haveMore: haveMore,
          page: page,
          list: res.body
        })
      } else {
        that.setData({
          haveMore: haveMore,
          page: page,
          list: that.list.concat(res.body),
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.findImage();
    that.findHotCommodity(1);
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
    if (that.data.haveMore) {
      that.findHotCommodity(that.data.page + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
