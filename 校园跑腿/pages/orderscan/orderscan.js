// pages/orderscan/orderscan.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    order:{},
    sender:{}

  },
  getsender: function (e) {
    if (app.globalData.userInfo.senderFlag){
      let sender=wx.getStorageSync("sender")
      if(sender==undefined||sender==null||sender==''){
        let query = {
          fields: ["realName", "classesNumber", "images", "status"],
          wheres: [{
            value: "userId", opertionType: "equal", opertionValue: app.globalData.userInfo.sunwouId
          }]
        }
        app.post("/sender/find", { query: JSON.stringify(query) }, function (res) {
          console.info(res)
          if (res.code) {
            if (res.params.senders != undefined && res.params.senders.length > 0) {
              let sender = res.params.senders[0];
              that.setData({
                sender: sender,
              })
            }
          } else {
            app.showFailToast(res.msg, 2000);
          }
        })
      }else{
        that.setData({
          sender: sender
        })
      }
      
    }
   
  },
  acceptorder:function(e){
    let userInfo=app.globalData.userInfo;
    if (userInfo.senderFlag){
      app.showModel("提示", "是否确认接单？",function(res){
        app.post("/sender/acceptorder",{
          orderId: that.data.order.sunwouId,
          senderId: that.data.sender.sunwouId
        },function(res){
          wx.navigateBack({
            delta: 1
          })
          wx.navigateTo({
            url: '/pages/myrunorder/myrunorder',
          })
        })
      })

    }else{
      app.showModel("提示","检测到您还未申请跑腿人员，是否前去申请？",function(res){
        wx.navigateTo({
          url: '/pages/runvalidate/runvalidate',
        })
      })
    }
  },
  getorderlist: function (sunwouId) {
    let query = {
      wheres: [{
        value: "type", opertionType: "equal", opertionValue: "跑腿订单"
        }, {
          value: "sunwouId", opertionType: "equal", opertionValue: sunwouId
        }]
    }
    app.post("/order/find", { query: JSON.stringify(query) }, function (res) {
      if (res.code) {
        let orderlist = res.params.orders;
        // orderlist.forEach(function (item, index) {
        //   that.timediffnow(item)
        // })
        that.setData({
          order: res.params.orders[0]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    let sunwouId=options.sunwouId;
    that.getorderlist(sunwouId);
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
      path: '/pages/orderscan/orderscan?sunwouId=' + that.data.order.sunwouId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})