//index.js
//获取应用实例
var app = getApp()
var util  = require('../../utils/util.js')
Page({
  data: {
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524630239066&di=0590bd088693b7f7acf1ad5f3f2b56c9&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20161210%2F051d4e1ded944c92b7c2f7f678703ca1_th.jpeg',
      
    ],
    shop:''
  },
  shoyihn(){
    if(wx.getStorageSync("app").shopId){
      wx.navigateTo({
        url: '/pages/shouyin/shouyin',
      })
    }
  },
  navToOrderlist(){
    wx.navigateTo({
      url: '/pages/orderlist/orderlist',
    })
  },
  navToRecharge(){
    if (wx.getStorageSync("app")) {
      if (wx.getStorageSync("phone")) {
        wx.navigateTo({
          url: '/pages/recharge/recharge',
        })
      } else {
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone',
        })
      }
    } else {
      app.login(function (res) {
        if (res.code) {
          wx.removeStorageSync('app')
          wx.setStorageSync('app', res.params.user);
          if (wx.getStorageSync("app").phone) {
            wx.navigateTo({
              url: '/pages/recharge/recharge',
            })
          } else {
            wx.navigateTo({
              url: '/pages/bindPhone/bindPhone',
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
    }
    
  },
  navToShopList() {
    wx.navigateTo({
      url: '/pages/shoplist/shoplist',
    })
  },
  navToList(){
    if(wx.getStorageSync("app").phone){
      wx.navigateTo({
        url: '/pages/list/list',
      })
    }else{
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone',
      })
    }
    
  },
  navToDetail(e) {
    wx.navigateTo({
      url: '/pages/list/list?id=' + e.currentTarget.dataset.id + '&shopName=' + e.currentTarget.dataset.name + '&box=' + e.currentTarget.dataset.box,
    })
  },
  getLocation(){
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.setData({
          lat:res.latitude,
          lng:res.longitude
        })
        wx.setStorageSync("lat", res.latitude)
        wx.setStorageSync("lng", res.longitude)
        that.getShop();
      },
      fail(){
        wx.openSetting({
          success: function(res) {
            if(res.authSetting["scope.userLocation"].userLocation){
              that.getShop();
            }else{
              wx.showModal({
                title: '温馨提示',
                content: '为了更好的服务于你，请打开位置授权',
                success(res){
                  if(res.confirm){
                    that.getLocation()
                  }else{
                    that.getLocation()
                  }
                }
              })
              
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },

  getShop(){
    var that = this;
    app.post('shop/find', {
      lat: that.data.lat,
      lng: that.data.lng,
      query: JSON.stringify(
        {
          fields: ["shopName", "open", "lat", "lng","boxPrice"],
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
            size: 1
          }
        }
      )
    }, function (data) {
      if (data.code) {
        data.params.list[0].uint = 'M'
        if (data.params.list[0].distance >= 1000) {
          data.params.list[0].uint = 'KM'
          data.params.list[0].distance = (data.params.list[0].distance / 1000).toFixed(1)
        }
        that.setData({
          shop: data.params.list[0]
        })
      }
    })
  },
  getCard: function (e) {
    if (wx.getStorageSync("app")) {
      if (wx.getStorageSync("phone")) {
        wx.navigateTo({
          url: '/pages/vip/vip',
        })
      } else {
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone',
        })
      }
    } else {
      app.login(function (res) {
        if (res.code) {
          wx.removeStorageSync('app')
          wx.setStorageSync('app', res.params.user);
          if (wx.getStorageSync("app").phone) {
            wx.navigateTo({
              url: '/pages/vip/vip',
            })
          } else {
            wx.navigateTo({
              url: '/pages/bindPhone/bindPhone',
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
    }
    
  },

  onLoad: function () {
    var that = this;
    this.getLocation()
    wx.getSystemInfo({
      success: function(res) {
        var sys = res;
        that.setData({
          width: sys.windowWidth,
        })
        
        if(wx.getStorageSync("app")){
          app.getUserInfo(function(res){
            that.setData({
              
              userInfo: wx.getStorageSync("app")
            })
          })
        }else{
          app.login(function (res) {
            if (res.code) {
              wx.removeStorageSync('app')
              wx.setStorageSync('app', res.params.user);
              app.getUserInfo(function (res) {
                that.setData({
                  width: sys.windowWidth,
                  userInfo: wx.getStorageSync("app")
                })
              })
            } else {
              wx.showToast({
                title: res.msg,
              })
            }
          })
        }
       
        
      },
    })
    this.getPhotos()
  },
  getPhotos(){
    var that = this;
    app.post('filesystem/find',{
      query: JSON.stringify({ "fields": [], "wheres": [{ "value": "userId", "opertionType": "equal", "opertionValue": app.uid }, { "value": "isDelete", "opertionType": "equal", "opertionValue": false }], "sorts": [], "pages": { "currentPage": 1, "size": 5 } })
    },function(res){
      
      if(res.code){
        var li  = res.params.list
        
        that.setData({
          imgs:li
        })
      }
    })
  },
  onShareAppMessage(){
    return {
      path:'/pages/index/index'
    }
  }
  
})
