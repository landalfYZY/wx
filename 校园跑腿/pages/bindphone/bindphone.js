// pages/bindphone/bindphone.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    code:""
  },
  phoneinput:function(e){
    that.setData({
      phone: e.detail.value
    })
    
  },
  codeinput:function(e){
    that.setData({
      code: e.detail.value
    })
  },
  getcode:function(){
    app.post("/common/getcode",{phone:that.data.phone},function(res){
      console.info(res)
      if(res.code){
        app.showSuccessToast("发送成功",2000);
      }else{
        app.showFailToast(res.msg,2000);
      }
    })
  },
  submit:function(){
    let data={
      userId: app.globalData.userInfo.sunwouId,
      phone:that.data.phone,
      code:that.data.code
    }
    app.post("/user/bindcode", data,function(res){
      console.info(res)
      if(res.code){
        app.globalData.userInfo=res.params.user;
        wx.navigateBack({
          delta: 1
        })
      }else{
        app.showFailToast(res.msg, 2000);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    
  
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
    return {
      title: '校生源跑腿',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})