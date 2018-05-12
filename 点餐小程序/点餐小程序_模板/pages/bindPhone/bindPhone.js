var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    value: '',
    time: 60,
    values: ['', '', '', ''],
    phone: '',
    text: '获取验证码'
  },
  getphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getYcode() {
    if (this.data.text == '获取验证码') {
      var that = this;
      if (this.data.phone == '') {
        wx.showToast({
          title: '手机号不能为空',
        })
      } else if (this.data.phone.length != 11) {
        wx.showToast({
          title: '输入11位手机号',
        })
      } else {
        app.post('send/sms', { phone: this.data.phone }, function (res) {
          that.setData({
            text: 's 后可再次请求'
          })
          var tim = setInterval(function () {
            that.setData({
              time: that.data.time - 1
            })
            if (that.data.time == 0) {
              clearInterval(tim)
              that.setData({
                text: '获取验证码'
              })
            }
          }, 1000)
        })
      }
    } 
  },
  getKeyBord() {
    this.setData({
      focus: true
    })
  },
  getNumber(e) {
    var sd = this.data.value;
    var str = e.detail.value;
    var li = ['', '', '', ''];
    if (str.length > 4) {
      for (var i = 0; i < 4; i++) {
        li[i] = (str[i])
      }
      str = sd
    } else {
      for (var i in str) {
        li[i] = str[i]
      }
    }
    this.setData({
      value: str,
      values: li
    })
    if (str.length == 4) {

      wx.showLoading({
        title: '验证中...',
      })
      this.getMes()
    }
  },
  getMes() {
    var that = this;
    app.post('send/vali',{
      phone:this.data.phone,
      code:this.data.value
    },function(res){
      wx.hideLoading()
      if(res.code){
        app.post('wxuser/update',{
          userId:wx.getStorageSync("app").sunwouId,
          phone:that.data.phone
        },function(res){
          if(res.code){
            wx.showToast({
              title: '绑定成功',
            })
            wx.setStorageSync('app', res.params.user);
            wx.setStorageSync('phone', that.data.phone)
            wx.navigateBack({
              delta:1
            })
          }else{
            wx.showToast({
              title: '更新失败',
              icon: 'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: '验证码错误',
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})