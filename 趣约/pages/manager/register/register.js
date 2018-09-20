var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registType:1,
    name:'',
    detail:'',
    contact:'',
    contactPhone:'',
    username:'',
    password:'',
    lpassword:'',
    address:'',
    lat:'',
    lng:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var title = options.name == 1 ?  '商铺入驻申请':'企业入驻申请';
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({ registType:options.name})
  },
  getLocation(){
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          address:res.address,
          lat:res.latitude,
          lng:res.longitude
        })
      },
    })
  }
})