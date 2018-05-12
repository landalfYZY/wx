// pages/search/search.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    like: '#',
    list: [],
    record: [],
    showRecord: false,
  },
  navToShop: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id,
    })
  },
  search:function(e){
    let record = that.data.record;
    record.forEach(function(item,index){
      console.info(item == that.data.like);
      if (item == that.data.like){
        record.splice(index,1);
      }
    })
      record.splice(0, 0, that.data.like);
      that.setData({
        record: record
      });
      wx.setStorageSync("record", record)
    app.post("shop/commoditysearch",{like:that.data.like,
      appid:app.sunwouId},function(res){
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
          item.min = min;
          item.max = max;
        }
      })
        that.setData({
          list: res.body
        })
    })
  },
  searchInput: function (e) {
    let key = e.detail.value;
    if (key == '') {
      key = '#'
    }
    that.setData({
      like: key
    })
  },
  focus() {
    that.setData({ showRecord: true })
  },
  blur() {
    that.setData({ showRecord: false })
  },
  clearRecord: function () {
    wx.showModal({
      title: '提示',
      content: '清空将无法找回记录，是否继续?',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("record", []);
          that.getRecord()
        }
      }
    })
  },
  recSearch(e) {
    that.setData({ like: e.currentTarget.dataset.item })
    that.search();
  },
   //获得历史记录
  getRecord: function (e) {
    if (wx.getStorageSync("record")) {
      that.setData({
        record: wx.getStorageSync("record")
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getRecord();
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