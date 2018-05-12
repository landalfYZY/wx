// pages/dianyuan/dianyuan.js
const app=getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:'女',
    name:'',
  
  },

selectSex(e){
  wx.showActionSheet({
    itemList: ['男', '女'],
    success: function (res) {
      console.log(res.tapIndex)
      if(res.tapIndex==0){
        that.setData({
          sex:'男'
        })
      }else if(res.tapIndex==1){
        that.setData({
          sex: '女'
        })
      }
    },
    fail: function (res) {
      console.log(res.errMsg)
    }
  })
},
  nameInput:function(e){
    that.setData({
      name:e.detail.value
    })
  },
  submit:function(e){
    let image={
      name:that.data.name,
      gender:that.data.sex,
      phone: app.globalData.userInfo.phone
    }
    let data={
      appid:app.sunwouId,
      type:2,
      image: JSON.stringify(image)
    }
    app.post("shop/imageandtextadd",data,function(res){
      if(res.code==1000){
        wx.setStorageSync("isdianyuan", that.data.name);
        app.showSuccessToast("成功",1200);
        setTimeout(function(res){
          wx.navigateBack({
            delta: 1
          })
        },1200)
      }else{
        app.showFailToast(res.result,2000);
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
  
  }
})