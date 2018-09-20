var app = getApp();
var com = require('../../utils/util.js')
var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    passWord:'',
    userName:''
  },
  pwdInput(e){
    this.setData({
      passWord:e.detail.value
    })
  },
  unInput(e){
    this.setData({
      userName: e.detail.value
    })
  },
  login(){
    this.setData({
      loading:true
    })
    com.login({userName:this.data.userName,passWord:this.data.passWord},function(res){
      that.setData({
        loading: false
      })
      wx.navigateBack({
        delta:-1
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this 
  },

})