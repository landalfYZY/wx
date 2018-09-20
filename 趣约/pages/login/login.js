var util = require("../../utils/util");

//var WXBizDataCrypt = require('../../utils/WXBizDataCrypt');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName:'',
    phone:''
  },
  realNameInput(e){
    this.setData({
      realName:e.detail.detail.value
    })
  },
  phoneInput(e){
    this.setData({
      phone: e.detail.detail.value
    })
  },
  /**
   * 获取用户信息 并 提交注册
   */
  getUserInfo(e){

    var userInfo      = e.detail.userInfo;
    userInfo.sunwouId = wx.getStorageSync("user").sunwouId;
    if (this.data.realName){
      userInfo.realName = this.data.realName;
    }
    if (this.data.phone){
      userInfo.phone = this.data.phone;
    }

    util.updateUser(userInfo,function(res){
      wx.navigateBack({
        delta: 1,
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

})