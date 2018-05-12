var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: ''
  },
  onLoad(options){
    if (wx.getStorageSync("app")){
      this.setData({
        name: wx.getStorageSync("app").nickName,
        phone: wx.getStorageSync("app").phone
      })
    }
  },
  nickInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
 
  submitPublic() {
    app.post('wxuser/update', {
      nickName: this.data.name,
      phone: this.data.phone,
      userId: wx.getStorageSync("app").sunwouId
    }, function (res) {
      if(res.code){
        wx.showToast({
          title: '修改成功',
        })
        wx.setStorageSync('app', res.params.user);
        wx.navigateBack({
          delta:1
        })
      }
    })
  }
})