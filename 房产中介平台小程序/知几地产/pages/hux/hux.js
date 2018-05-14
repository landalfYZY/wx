var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'',
    msg:null,
    iss:false
  },
  preview() {
    var that = this
    var uls = [];
    
      uls.push(that.data.msg.img)
    
    wx.previewImage({
      urls: uls,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.iss) {
      this.setData({
        iss: true
      })
    }
    this.setData({
      status:options.status,
      msg:JSON.parse(options.data)
    })
  },
  makephoneCall() {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('showData')[0].admin.phone,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      path:'/pages/hux/hux?status='+this.data.status+'&data='+this.data.msg+'&iss=1'
    }
  } 
})