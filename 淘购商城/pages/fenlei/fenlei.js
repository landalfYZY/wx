// pages/fenlei/fenlei.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curNav: 4,
    page:1,
    navList: [
      { 'id': 4, 'name': '孕婴用品', },
      { 'id': 5, 'name': '服装鞋帽', },
      { 'id': 6, 'name': '婚庆用品', },
      { 'id': 7, 'name': '数码电脑', },
      { 'id': 8, 'name': '手机配件', },
      { 'id': 9, 'name': '家用电器', },
      { 'id': 10, 'name': '彩妆美容', },
      { 'id': 11, 'name': '其他', },
    ],
    haveMore:true
  },
  navToShop: function (e) {
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?id='+id,
    })
  },
  selectNav:function(e){
    let id=e.currentTarget.dataset.id;
    that.setData({
      curNav: id,
      page:1
    });
    that.filter(id,1)
  },
  filter(category, page) {
    app.post('shop/findcommodity', {
      appid: app.sunwouId,
      page: page,
      size: app.pageSize,
      categoryId: category
    }, function (res) {
      if (res.code == 1000 && res.body != null && res.body != undefined) {
        res.body.forEach(function (item, index) {
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
            item.min = min;
            item.max = max;
            item.dismin = (min * item.discount).toFixed(2);
            item.dismax = (max * item.discount).toFixed(2);
            item.image = JSON.parse(item.image)
          }

        })
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

      }else {
        that.setData({
          list: []
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.filter(that.data.curNav,that.data.page);
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
    that.filter(that.data.curNav, that.data.page+1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})