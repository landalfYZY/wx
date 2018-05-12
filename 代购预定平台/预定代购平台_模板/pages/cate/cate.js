var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:[
      { name: '全球', active: true }, { name: '韩国', active: false }, { name: '香港', active: false }, { name: '新加坡', active: false }, { name: '日本', active: false }, { name: '英国', active: false }, { name: '美国', active: false }
    ],
    cateFlag:0,
    cateList:[],
    countryFlag:0,
    countryList:[],
    goodsList:[],
    pubQuery: {
      fields: ["image","name"],
      wheres: [
        {
          value: "appid",
          opertionType: "equal",
          opertionValue: ''
        },
        {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        },
        {
          value: "show",
          opertionType: "equal",
          opertionValue: true
        }
      ],
      sorts: [
        { value: "createTime", asc: true }
      ],
      pages: {
        currentPage: 1,
        size: 21
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.pubQuery.wheres[0].opertionValue = app.id
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          pubQuery: that.data.pubQuery,
          height:res.windowHeight,
          width:res.windowWidth
        })
      },
    })
    this.getCate()
    this.getCountry()
  },
  chooseCate(e){
    var that = this;
    if (e.currentTarget.dataset.index != that.data.cateFlag){
      that.data.cateList[e.currentTarget.dataset.index].active = true;
      that.data.cateList[that.data.cateFlag].active = false;
      var temp = -1;
      for (var i in that.data.pubQuery.wheres) {
        if (that.data.pubQuery.wheres[i].value == "categoryid") {
          temp = i
        }
      }
      if (temp == -1) {
        that.data.pubQuery.wheres.push({
          value: "categoryid",
          opertionType: "equal",
          opertionValue: e.currentTarget.dataset.id
        })
      } else {
        that.data.pubQuery.wheres[temp].opertionValue = e.currentTarget.dataset.id
      }
      this.setData({
        pubQuery: that.data.pubQuery,
        cateList: that.data.cateList,
        cateFlag: e.currentTarget.dataset.index
      })
      this.getGoods(0)
    }
    
  },
  chooseCountry(e) {
    var that = this;
    that.data.countryList[e.currentTarget.dataset.index].active = true;
    that.data.countryList[that.data.countryFlag].active = false;
    var temp = -1;
    for (var i in that.data.pubQuery.wheres) {
      if (that.data.pubQuery.wheres[i].value == "tempId") {
        temp = i
      }
    }
    if (temp == -1) {
      if (e.currentTarget.dataset.index != 0){
        that.data.pubQuery.wheres.push({
          value: "tempId",
          opertionType: "equal",
          opertionValue: e.currentTarget.dataset.id
        })
      }
    } else {
      if (e.currentTarget.dataset.index == 0){
        that.data.pubQuery.wheres.splice(temp,1);
      }else{
        that.data.pubQuery.wheres[temp].opertionValue = e.currentTarget.dataset.id;
      }
    }
    this.setData({
      pubQuery: that.data.pubQuery,
      countryList: that.data.countryList,
      countryFlag: e.currentTarget.dataset.index
    })
    this.getGoods(0)
  },
  getCate(){
    var that = this
    wx.showNavigationBarLoading();
    app.post('productcategory/find',{
      query: JSON.stringify(
        {
        fields: ["name"],
        wheres: [
          { value: "appid", opertionType: "equal", opertionValue: app.id },
          { value: "type", opertionType: "equal", opertionValue: 'category' },
          { value: "isDelete", opertionType: "equal", opertionValue: false }
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 100
        }})},
        function(res){
          wx.hideNavigationBarLoading()
          if(res.code){
            for (var i in res.params.list){
              res.params.list[i].active = false
            }
            res.params.list[0].active = true
            that.data.pubQuery.wheres.push({
              value: "categoryid",
              opertionType: "equal",
              opertionValue: res.params.list[0].sunwouId})
            that.setData({
              pubQuery:that.data.pubQuery,
              cateFlag:0,
              cateList:res.params.list
            })
            that.getGoods(0)
          }else{

          }
        })
  },
  getCountry() {
    var that = this
    wx.showNavigationBarLoading();
    app.post('productcategory/find', {
      query: JSON.stringify(
        {
          fields: ["name"],
          wheres: [
            { value: "appid", opertionType: "equal", opertionValue: app.id },
            { value: "type", opertionType: "equal", opertionValue: 'country' },
            { value: "isDelete", opertionType: "equal", opertionValue: false }
          ],
          sorts: [],
          pages: {
            currentPage: 1,
            size: 100
          }
        })
    },
      function (res) {
        wx.hideNavigationBarLoading()
        if (res.code) {
          var li = [];
          li.push({name:'全球',active:true})
          for (var i in res.params.list) {
            res.params.list[i].active = false
            li.push(res.params.list[i])
          }
          that.setData({
            countryFlag: 0,
            countryList: li
          })
        } else {

        }
      })
  },
  getGoods(num){
    wx.showNavigationBarLoading()
    var that = this;
    if(num == 1){
      this.data.pubQuery.pages.currentPage += 1
    }else{
      this.data.pubQuery.pages.currentPage = 1
    }
    app.post('product/find',{
      query:JSON.stringify(this.data.pubQuery)
    },function(res){
      wx.hideNavigationBarLoading()
      if(res.code){
        var li = []
        for (var i in res.params.list){
          res.params.list[i].image = JSON.parse(res.params.list[i].image)
          res.params.list[i].image[0].url = res.params.list[i].image[0].url.replace('-', '-thumbnail')
        }
        if(num == 1){
          li = that.data.goodsList
          for (var i in res.params.list){
            li.push(res.params.list[i])
          }
        }else{
          li = res.params.list
        }
        that.setData({
          goodsList: li,
          total:res.params.total
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.total > this.data.goodsList.length){
      this.getGoods(1)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})