const app = getApp()
var com = require('../../../utils/common.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    build:[],
    formData:{
      realName: '',
      phone: '',
      floor: '',
      des: '',
      buildName: '请选择(必选)'
    },
    
  },
  input(e){
    var formData = this.data.formData;
    formData[e.currentTarget.dataset.name] = e.detail.value
    this.setData({
      formData : formData
    })
  },
  bindPickerChange(e){
    var formData = this.data.formData;
    formData.buildName = this.data.build[e.detail.value];
    this.setData({
      formData: formData
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that              = this;
    var formData      = this.data.formData;
    
    if(wx.getStorageSync("address")){
      formData = wx.getStorageSync("address") ? wx.getStorageSync("address") : ''
    }else{
      formData.realName = wx.getStorageSync("user").realName ? wx.getStorageSync("user").realName : '';
      formData.phone = wx.getStorageSync("user").phone ? wx.getStorageSync("user").phone : '';
    }
    this.setData({
      build    : JSON.parse(options.list),
      formData : formData  
    })
  },

  onSubmit(){
    var str = [
      { label:'realName',msg:'请输入联系人'},
      { label: 'phone', msg: '请输入联系方式' },
      { label: 'floor', msg: '请输入楼层' }
      ];
    var temp = -1;
    var formData = this.data.formData;
    for(var i in str){
      if(formData[str[i].label] == ''){
        temp = i;
      }
    }
    if(temp != -1){
      wx.showToast({
        title: str[temp].msg,
        icon:'none  '
      })
    }else{
      var user = wx.getStorageSync("user");
      if (wx.getStorageSync("user").realName != formData.realName
        && wx.getStorageSync("user").phone != formData.phone) {
        com.updateUser({
          realName:formData.realName,
          phone:formData.phone},function(res){
          if(res.code){
            user.realName = formData.realName,
            user.phone    = formData.phone
            wx.setStorageSync("user", user);
          }
        })
      }

      var address = formData;

      var prePage = com.prePage();
      wx.setStorageSync("address", address);
      prePage.setData({
        address:address
      })
      wx.navigateBack({
        delta:1
      })
    }
  },
})