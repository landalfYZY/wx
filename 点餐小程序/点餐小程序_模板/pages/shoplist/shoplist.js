var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0,
    list:[],
    load:false,
    pubQuery: {
      fields: ["shopName", "shopImage", "province", "city", "area", "shopAddress", "lat", "lng", "boxPrice"],
      wheres: [
        {
          value: "appid",
          opertionType: "equal",
          opertionValue: app.id
        },
        {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        }
      ],
      sorts: [{ value: 'createTime', asc: false }],
      pages: {
        currentPage: 1,
        size: 10
      }
    }
  },
  navToDetail(e){
    wx.navigateTo({
      url: '/pages/list/list?id=' + e.currentTarget.dataset.id + '&shopName=' + e.currentTarget.dataset.name + '&box=' + e.currentTarget.dataset.box,
    })
  },
  searchInput(e){
    var that = this;
    var temp = -1;
    for (var i in this.data.pubQuery.wheres){
      if (this.data.pubQuery.wheres[i].value == "shopName"){
        temp = i
      }
    }
    if(temp == -1){
      this.data.pubQuery.wheres.push({
        value: "shopName",
        opertionType: "like",
        opertionValue: e.detail.value})
    }else{
      this.data.pubQuery.wheres[i].opertionValue = e.detail.value
    }
    this.setData({
      pubQuery:that.data.pubQuery
    })
    this.getShopList(0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopList(0)
  },

  getShopList(num){
    this.setData({
      load:true
    })
    var that = this;
    if(num == 1){
      this.data.pubQuery.pages.currentPage += 1;
    }else{
      this.data.pubQuery.pages.currentPage == 1
    }
    app.post('shop/find', {
      lat: wx.getStorageSync("lat"),
      lng: wx.getStorageSync("lng"),
      query:JSON.stringify(this.data.pubQuery)},function(res){
      if(res.code){
        var li = []
        for (var i in res.params.list){
          res.params.list[i].shopImage = res.params.list[i].shopImage.replace('-', '-thumbnail')
          res.params.list[i].unit = 'M'
          if(res.params.list[i].distance >= 1000){
            res.params.list[i].unit = 'KM'
            res.params.list[i].distance = (res.params.list[i].distance/1000).toFixed(1)
          }
        }
        if(num == 1){
          li = that.data.list
          for (var i in res.params.list){
            li.push(res.params.list[i])
          }
        }else{
          li = res.params.list
        }
        that.setData({
          list:li,
          load: false,
          total:res.params.total
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
        that.setData({
          load: false
        })
      }
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getShopList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getShopList(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path:'/pages/shopList/shopList'
    }
  }
})