var util = require("../../utils/util.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publicType:'个人',
    disabled:false,
    swcheck:false,
    atype:[],
    persons:[],
    days:[],
    dflag:0,
    pflag:0,
    aflag:-1,
    address:'',
    title:'',
    payEveryOne:0,
    tempFilePath:'',
    image:'',
    stopTime:'',
    startDate:'',
    date:'',
    time:'13:00',
    payStatus:false,
    needPeopleNumber:1
  },
  getSw(e){
    this.setData({
      payStatus: e.detail.value
    })
  },
  bindDateChange(e){
    this.setData({
      date:e.detail.value
    })
  },
  bindTimeChange(e){
    this.setData({
      time: e.detail.value
    })
  },
  scphoto(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePath: tempFilePaths[0]
        })
      }
    })
  },
  titleInput(e){
    this.setData({
      title:e.detail.value
    })
  },
  payEveryOneInput(e){
    this.setData({
      payEveryOne: e.detail.value
    })
  },
  bindAtypeChange(e){
    this.setData({
      aflag:e.detail.value
    })
  },
  bindPersonChange(e){
    this.setData({
      needPeopleNumber: e.detail.value
    })
  },
  bindDayChange(e){
    this.setData({
      dflag: e.detail.value
    })
  },
  chooseAddress(){
    wx.chooseLocation({
      success(res){
        that.setData({
          address: res.name
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var startDate = '';
    var da = new Date();

    that.setData({
      atype:util.ATYPE,
      persons: util.PERPLE_NUM,
      days: util.DAY_NUM,
      startDate: da.getFullYear() + '-' + (da.getMonth() + 1) + '-' + da.getDate() ,
      date:da.getFullYear()+'-'+(da.getMonth()+1)+'-'+(da.getDate()+1),
      time:(da.getHours()+1)+':00'
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
  textInput(e){
    this.setData({
      text: e.detail.value
    })
  },
  handleClick(){
    wx.showLoading({
      title: '请稍等',
      mask:true
    })
    if (this.data.tempFilePath == ''){
      wx.showToast({
        title: '请上传一张图片',
        icon:'none'
      })
    }else{
      wx.uploadFile({
        url: util.API + 'file/upload', //仅为示例，非真实的接口地址
        filePath: this.data.tempFilePath,
        name: 'file',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        formData: {
          'userId': wx.getStorageSync("user").sunwouId
        },
        success: function (res) {
          var res = JSON.parse(res.data);
          if (res.code) {
            wx.hideLoading();
            wx.showToast({
              title: '发布成功',
            })
            var img = res.msg;
            util.post('activity/add', {
              publicType:that.data.publicType,
              image: img,
              userId: wx.getStorageSync("user").sunwouId,
              title: that.data.title ? that.data.title : wx.showToast({ title: '请输入活动主题', icon: 'none' }),
              address: that.data.address ? that.data.address : wx.showToast({ title: '请选择活动地址', icon: 'none' }),
              stopTime: that.data.date + ' ' + that.data.time +':00',
              text: that.data.text,
              needPeopleNumber: that.data.needPeopleNumber,
              payEveryOne: that.data.payEveryOne,
              payStatus: that.data.payStatus,
              type: that.data.aflag == -1 ? wx.showToast({ title: '请选择活动类型', icon: 'none' }) : that.data.atype[that.data.aflag],
              day: that.data.days[that.data.dflag]
            }, function (res) {
              if(res.code){
                wx.redirectTo({
                  url: '/pages/activity/activity?id='+res.msg,
                })
              }
            })
          }

        }
      })
    }
    
    
  }
})