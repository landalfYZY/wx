
const app = getApp()
var com = require('../../utils/common.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    keyword:'',
    city:['杭州','湖州','上海','嘉兴'],
    cityFlag:0
  },
  bindPickerChange(e){
    this.setData({
      cityFlag:e.detail.value
    })
    this.getLocation()
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getLocation();
  },
  doSearch(e){
    this.setData({
      keyword:e.detail.value
    })
    this.getLocation()
  },
  getLocation(){
    wx.request({
      url: com.config.MAP_API+'place/v2/suggestion',
      method:'get',
      dataType:'json',
      data:{
        query: this.data.keyword != "" ? this.data.keyword :'写字楼',
        region:this.data.city[this.data.cityFlag],
        output:'json',
        ak:com.config.KEY,
        ret_coordtype: 'db09'
      },
      success(res){
        that.setData({
          list:res.data.result
        })
      }
    })
  },
  chooseLocation(e){
    wx.setStorageSync("location", this.data.list[e.currentTarget.dataset.index])
    wx.setStorageSync("reload", true)
    wx.navigateBack({
      delta:1
    })
  },
  onShow(){
    
  },
})