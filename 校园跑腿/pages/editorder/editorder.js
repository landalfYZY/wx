// pages/editorder/editorder.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    runorder:{
      name:"",
      phone:"",
      address:"",
      subType:"普通",
      amount:1,
      schoolId:"",
      userId:"",
      reserveTime:"",
      remark:"",
      secret:"",      
    },
    date: '2016-09-01',
    starttime: "12:00",
    endtime: "12:30",
    money: 1,
    minmoney:0.1,
    reducebtnabled: true
  },
  //input输入事件
  moneyinput: function (e) {
    that.setData({
      money: e.detail.value,
    })
  },
  secretinput: function (e) {
    let runorder = that.data.runorder;
    runorder.secret=e.detail.value;
    that.setData({
      runorder: runorder
    })
  },
  contactinput: function (e) {
    let runorder = that.data.runorder;
    runorder.name = e.detail.value;
    that.setData({
      runorder: runorder
    })
  },
  addressinput: function (e) {
    let runorder = that.data.runorder;
    runorder.address = e.detail.value;
    that.setData({
      runorder: runorder
    })
  },
  phoneinput: function (e) {
    let runorder = that.data.runorder;
    runorder.phone = e.detail.value;
    that.setData({
      runorder: runorder
    })
  },
  runtextinput: function (e) {
    let runorder = that.data.runorder;
    runorder.remark = e.detail.value;
    that.setData({
      runorder: runorder
    })
  },
  radioChange:function(e){
    let runorder = that.data.runorder;
    runorder.subType = e.detail.value;
    that.setData({
      runorder: runorder
    })
  },


  bindDateChange: function (e) {
    that.setData({
      date: e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    that.setData({
      starttime: e.detail.value
    })
  },
  moneyblur: function (e) {
    let money = e.detail.value;
    let reducebtnabled;
    if (money < that.data.minmoney) {
      money = that.data.minmoney;
      reducebtnabled = true;
    } else {
      reducebtnabled = false;
    }
    that.setData({
      money: money,
      reducebtnabled: reducebtnabled
    })
  },
 
  reduceclick: function (e) {
    let money = parseInt(that.data.money*1) - 1;
    let reducebtnabled;
    if (money <= that.data.minmoney) {
      money = that.data.minmoney;
      reducebtnabled = true;
    }else{
      reducebtnabled=false;
    }
    that.setData({
      money: money,
      reducebtnabled: reducebtnabled
    })
  },
  addclick: function (e) {
    let money = parseInt(that.data.money*1)+1;
    that.setData({
      money: money,
      reducebtnabled: false
    })
  },
  bindEndTimeChange: function (e) {
    that.setData({
      endtime: e.detail.value
    })
  },
  gettime() {
    let time = new Date();
    console.info(time)
    let nowdate = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate();
    
    let nowtime = (time.getHours() >= 10 ? time.getHours() : "0" + time.getHours()) + ":" + (time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes());
    let endtime = new Date(time.getTime() + 2 * 24 * 60 * 60 * 1000);
    let enddate = endtime.getFullYear() + "-" + (endtime.getMonth()+1) + "-" + endtime.getDate();
    let end = new Date(time.getTime() + 1800000);
    let endover = (end.getHours() >= 10 ? end.getHours() : "0" + end.getHours()) + ":" + (end.getMinutes() >= 10 ? end.getMinutes() : "0" + end.getMinutes());
    that.setData({
      date: nowdate,
      enddate: enddate,
      starttime: nowtime,
      endtime: endover
    })
  },
  pay:function(orderId){
    app.post("/order/pay", { sunwouId: orderId, payment:"wx"},function(res){
      console.info(res)
      if(res.code){
        that.wxpay(res.params.msg)
      }else{
        app.showFailToast(res.msg, 2000);
      }
    })
  },
  wxpay: function (data) {
    console.info(data)
    wx.requestPayment({
      'timeStamp': data.time,
      'nonceStr': data.nonceStr,
      'package': 'prepay_id=' + data.prepay_id,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        console.info(res);
        wx.navigateBack({
          delta: 1
        })
      },
      'fail': function (res) {
        console.info(res)
        wx.navigateBack({
          delta: 1
        })
        wx.navigateTo({
          url: '/pages/myorder/myorder',
        })

      },

    })
  },
  submit:function(e){
    let runorder = that.data.runorder;
    runorder.amount=that.data.money;
    runorder.reserveTime = that.data.date + "  " + that.data.starttime + "-" + that.data.endtime;
    runorder.userId=app.globalData.userInfo.sunwouId;
    let school=wx.getStorageSync("school");
    runorder.schoolId=school.sunwouId;
    app.post("/order/addrun", runorder,function(res){
      console.info(res)
      if(res.code){
        that.pay(res.msg);
      }else{
        app.showFailToast(res.msg,2000);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.gettime();
    if (that.data.money <= that.data.minmoney){
      that.setData({
        reducebtnabled: true
      })
    }else{
      that.setData({
        reducebtnabled: false
      })
    }
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