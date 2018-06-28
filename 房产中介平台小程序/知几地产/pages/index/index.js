//index.js
//获取应用实例
const app = getApp()
var china = require('../../utils/area.js')
Page({
  data: {
    loadAgent:false,
    load: false,
    cityText: '周边',
    iconList: [
      { image: '/img/s1.png', label: '二手房', color: '#00c482' },
      { image: '/img/s2.png', label: '新房', color: '#FF6600' },
      { image: '/img/s3.png', label: '租房', color: '#FF9900' },
      { image: '/img/s4.png', label: '卖房', color: '#FF6666' },
      { image: '/img/s5.png', label: '出租', color: '#66CCFF' },
    ],
    list: []
  },
  navToSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  navToDetail(e) {
    var str = '/pages/'
    if(e.currentTarget.dataset.name == '二手房'){
      str += 'houseDetail/houseDetail?id='+e.currentTarget.dataset.id
    } else if (e.currentTarget.dataset.name == '新房'){
      str += 'newDetail/newDetail?id=' + e.currentTarget.dataset.id
    }else{
      str += 'detail/detail?id=' + e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: str,
    })
  },
  navToList(e) {
    if (e.currentTarget.dataset.index == 0) {
      wx.navigateTo({
        url: '/pages/house/house',
      })
    }
    if (e.currentTarget.dataset.index == 1) {
      wx.navigateTo({
        url: '/pages/new/new',
      })
    }
    if (e.currentTarget.dataset.index == 2) {
      wx.navigateTo({
        url: '/pages/list/list',
      })
    }
    if (e.currentTarget.dataset.index == 3){
      if (wx.getStorageSync('app').nickName) {
        this.setData({
          phone: app.phone,
          userInfo: wx.getStorageSync('app')
        })
      } else {
        app.getUserInfo(function (res) {
          if (res.code) {
            wx.setStorageSync('app', res.params.user);
            this.setData({
              phone: app.phone,
              userInfo: wx.getStorageSync('app')
            })
          } else {
            wx.showToast({
              title: res.msg,
            })
          }
        })
      }
        wx.navigateTo({
          url: '/pages/pubhouse/pubhouse',
        })
      
      
    }
    if (e.currentTarget.dataset.index == 4) {
      if (wx.getStorageSync('app').nickName) {
        this.setData({
          phone: app.phone,
          userInfo: wx.getStorageSync('app')
        })
      } else {
        app.getUserInfo(function (res) {
          if (res.code) {
            wx.setStorageSync('app', res.params.user);
            this.setData({
              phone: app.phone,
              userInfo: wx.getStorageSync('app')
            })
          } else {
            wx.showToast({
              title: res.msg,
            })
          }
        })
      }
      wx.navigateTo({
        url: '/pages/pubDetail/pubDetail',
      })

    }

  },
  onPullDownRefresh(){
    this.getList()
  },
  getCity() {
    wx.navigateTo({
      url: '/pages/area/area',
    })
  },
  onLoad: function (options) {
    var that = this;
    if(wx.getStorageSync("city")){
      this.setData({
        cityText: wx.getStorageSync("city")
      })
    }else{
      wx.setStorageSync("city", "杭州")
    }
    this.getList();
    wx.setNavigationBarTitle({
      title: wx.getStorageSync("appName"),
    })
  },
  getList() {
    wx.showNavigationBarLoading();
    var that = this;
    var query = {
      fields: [],
      wheres: [
        {
          value: "miniId",
          opertionType: "equal",
          opertionValue: app.id
        },
        {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        },
        {
          value: "remark2",
          opertionType: "equal",
          opertionValue: '上架'
        }
      ],
      sorts: [],
      pages: {
        currentPage: 1,
        size: 20
      }
    }
    
    app.post('exh/find', {
      query:JSON.stringify(query)
    }, function (res) {
      if (res.code) {
        for (var i in res.params.result) {
          res.params.result[i].config.cover = res.params.result[i].config.cover.replace('-','-thumbnail')
          res.params.result[i].images = JSON.parse(res.params.result[i].images)
          res.params.result[i].config.tag = JSON.parse(res.params.result[i].config.tag)
        }
        var li = [];
          li = res.params.result
       wx.stopPullDownRefresh()
        that.setData({
          list: li,
          total: res.params.total,
          load: false
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 800
        })
      }
      wx.hideNavigationBarLoading()
    })
  },
  onShow(){
    if (this.data.loadAgent){
      this.getList()
      this.data.loadAgent = false
    }
  },
  onShareAppMessage(){
    return {
      title:'知己地产',
      path:'/pages/index/index'
    }
  }
})
