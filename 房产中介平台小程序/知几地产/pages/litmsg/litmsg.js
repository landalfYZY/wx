var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    title:'',
    mnum:0,
    lnum:0,
    pnum:0,
    minPrice:0,
    ty:1
  },
  submitPublic(){
    var ty = this.data.ty
    var remark1 = '二手房'
    if(ty == 1){
      remark1 = '二手房'
    }else{
      remark1 = '租房'
    }


    if(this.data.title == ''){
      wx.showToast({
        title: '小区名称不能为空',
        icon:'none'
      })
    } else if (this.data.lnum == ''){
      wx.showToast({
        title: '楼栋号不能为空',
        icon: 'none'
      })
    } else if (this.data.pnum == '') {
      wx.showToast({
        title: '门牌号不能为空',
        icon: 'none'
      })
    } else if (this.data.name == '') {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none'
      })
    } else if (this.data.phone == '') {
      wx.showToast({
        title: '联系方式不能为空',
        icon: 'none'
      })
    }else{
      wx.showLoading({
        title: '提交中...',
        mask: true
      })

      app.post('exh/add', {
        title: this.data.title,
        minPrice: this.data.minPrice,
        remark1: remark1,
        remark2: 'userpub',
        userId: app.uid,
        miniId: app.id,
        config: JSON.stringify({
          wxuid: wx.getStorageSync("app").sunwouId,
          lnum: this.data.lnum,
          pnum: this.data.pnum,
          mnum: this.data.mnum,
          name: this.data.name,
          phone: this.data.phone
        })
      }, function (res) {
        wx.hideLoading()
        if (res.code) {
          wx.showToast({
            title: '发布成功',
            duration: 800,

          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 800)
        }
      })
    }
    
  },
  titleInput(e){
    this.setData({
      title:e.detail.value,
    })
  },
  areaInput(e) {
    this.setData({
      lnum: e.detail.value,
    })
  },
  areaqInput(e){
    this.setData({
      mnum: e.detail.value,
    })
  },
  areasInput(e) {
    this.setData({
      pnum: e.detail.value,
    })
  },
  priceInput(e){
    this.setData({
      minPrice: e.detail.value,
    })
  },
  nameInput(e){
    this.setData({
      name: e.detail.value,
    })
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var name = ''
    var phone = ''
    var ty = options.type
    if(ty == 2){
      wx.setNavigationBarTitle({
        title: '出租房源',
      })
    }
    if (wx.getStorageSync("app")) {
      var name = wx.getStorageSync("app").nickName
      var phone = wx.getStorageSync("app").phone
      
    }
    this.setData({
      name: name,
      phone: phone,
      ty:ty
    })
  },

 
  
})