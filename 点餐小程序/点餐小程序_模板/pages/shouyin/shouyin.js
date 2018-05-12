var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updates:true,
    list: [],
    load: false,
    ct:1,
    query: {
      fields: [],
      wheres: [
        {
          value: "shop.sunwouId",
          opertionType: "equal",
          opertionValue: wx.getStorageSync("app").shopId
        },
        {
          value: "status",
          opertionType: "equal",
          opertionValue: '待取货'
        },
        {
          value: "type",
          opertionType: "ne",
          opertionValue: '充值'
        }
      ],
      sorts: [{ value: 'createTime', asc: false }],
      pages: {
        currentPage: 1,
        size: 10
      }
    }
  },
  changeTs(e){
    var that = this;
    if (e.currentTarget.dataset.id == 1){
      this.data.query.wheres[1].opertionValue = '待取货'
    }else{
      this.data.query.wheres[1].opertionValue = '已完成'
    }
    
    this.setData({
      ct:e.currentTarget.dataset.id
    })
    this.getOrders(0)
  },
  getHuo(e){
    var that = this;
    app.post('takeoutorder/update',{
      sunwouId:e.currentTarget.dataset.id,
      status:'已完成'
    },function(res){
      if(res.code){
        wx.showToast({
          title: '取货成功',
        })
        that.getOrders(0)
      }
    })
  },
  submitForm(e){
    var that = this
    if(this.data.updates){
      if (wx.getStorageSync("app").shopId) {
        app.post('wxuser/updatew', {
          sunwouId: wx.getStorageSync("app").sunwouId,
          form_id: e.detail.formId,
        }, function (res) {
          if (res.code) {
            that.setData({
              updates: false
            })
          }
        })
      }
    }
  },
  getOrders(num) {
    this.setData({
      load: true
    })
    if (num == 0) {
      this.data.query.pages.currentPage = 1
    } else {
      this.data.query.pages.currentPage += 1
    }
    var that = this;
    app.post('takeoutorder/find', { query: JSON.stringify(this.data.query) }, function (res) {
      if (res.code) {
        var li = that.data.list
        if (num == 0) {
          li = res.params.list
        } else {
          for (var i in res.params.list) {
            li.push(res.params.list[i])
          }
        }
        that.setData({
          load: false,
          list: li
        })
      } else {
        that.setData({
          load: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders(0)
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