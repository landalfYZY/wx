// pages/runvalidate/runvalidate.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip:"",
    imgip:"",
    studentimg:"",
    sender:{},
    submitbtndis:false
  },
  getsender:function(e){
    let query={
      fields: ["realName", "classesNumber", "images","status"],
      wheres:[{
        value: "userId", opertionType: "equal", opertionValue:app.globalData.userInfo.sunwouId
      }]
      }
    app.post("/sender/find",{query:JSON.stringify(query)},function(res){
      console.info(res)
      if(res.code){
        if (res.params.senders != undefined && res.params.senders.length>0){
          let sender = res.params.senders[0];
          let submitbtndis=false;
          if (sender.status=="待审核"||sender.status=="审核通过"){
            submitbtndis=true;
          }
          that.setData({
            sender: sender,
            studentimg: sender.images[0],
            submitbtndis: submitbtndis
          })
        }
      }else{
        app.showFailToast(res.msg,2000);
      }
    })
  },
  updatesender:function(e){

  },
  formSubmit:function(e){
    console.info(e);
    let userInfo=app.globalData.userInfo;
    let school=wx.getStorageSync("school")
    if(school==undefined||school==null){
      wx.navigateTo({
        url: '/pages/schoolselect/schoolselect',
      })
    }else{
      if (that.data.studentimg==""){
        app.showModel("提示","请上传您的学生证照片！！");
      }else{
        let data = {
          formid: e.detail.formId,
          realName: e.detail.value.realName,
          classesNumber: e.detail.value.classesNumber,
          gender: userInfo.gender,
          phone: userInfo.phone,
          images: [that.data.studentimg].toString(),
          userId: userInfo.sunwouId,
          schoolId: school.sunwouId,
          rate: 0.06,
          classes: "跑腿"
        }
        app.post("/sender/add", data, function (res) {
          console.info(res)
          if (res.code) {
            that.setData({
              submitbtndis: true
            })
            app.showSuccessToast(res.msg, 2000);
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          } else {
            app.showFailToast(res.msg, 2000);
          }
        })
      }
      
    }
    
  },
  uploadimg:function(e){
    wx.chooseImage({
      count: 1,
      sizeType: ["original"],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.info(res);
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: that.data.ip +"/file/up",
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            type:"image",
            compress:"false"
          },
          success: function (res) {
            var data = res.data
            data=JSON.parse(data);
            that.setData({
              studentimg:that.data.imgip+data.params.path
            })
            //do something
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      ip:app.ip,
      imgip:app.imgip
    })
    that.getsender();
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