//index.js
//获取应用实例
const app = getApp()
var com = require('../../utils/common.js')
var that ;
Page({
  data: {
    load:false,
     city:'杭州',
     lat:0, lng:0,
     shopList:[],
     current:0
  },
  //轮播图切换
  changeCurrent(e) {
    this.setData({
      current: e.detail.current
    })
  },
  navTo(e){
    com.wxNavgiteTo(e.currentTarget.dataset.navurl,["id"],e.currentTarget.dataset)
  },
  onLoad: function () {
    that = this;
    com.setTitleBarColor('#ffffff','#4b7bcf');
    this.setData({ load: true })
    this.login()
  },
  onShow(){
    if(wx.getStorageSync("reload")){
      this.getLocation()
      wx.setStorageSync("reload", false)
    }
  },
  //登录
  login(){
    com.login(function (res) {
      that.setData({ load: false })
      that.getLocation()
    })
  },
  //获取位置
  getLocation(){
    this.setData({ load: true })
    com.location(function(res){
      that.setData(res);
      that.getShop();
      wx.stopPullDownRefresh()
    })
  },
  //天气查询   暂不支持
  getWeither(){
    com.dget(com.config.MAP_API +'telematics/v3/weather',{
      location:'',
      ak:com.config.KEY
    },function(res){
      console.log(res)
    })
  },

  //获取店铺
  getShop(){
    
    com.post('shop/findbydistance',{
      userId:wx.getStorageSync("user").sunwouId,
      lat:this.data.lat,
      lng:this.data.lng,
      city:this.data.city
    },function(res){
      var li = []
      if(res.code){
        for(var i in res.params.shop){
          res.params.shop[i].address = res.params.shop[i].address.substring(
            res.params.shop[i].address.indexOf("县")+1 || res.params.shop[i].address.indexOf("区")+1, res.params.shop[i].address.length
          )
        }
        li = res.params.shop
      }else{
        wx.showToast({
          title: '服务器异常',
          icon:'none'
        })
      }
      that.setData({
        load: false,
        shopList: li
      })
       
    })
  },

  onPullDownRefresh: function () {
    that.getLocation()
  },
  onShareAppMessage(){
    return {
      title:'分享给好友，百万红包等你拿！',
      path:'/pages/index/index?userId='+wx.getStorageSync("user").sunwouId
    }
  }
})
