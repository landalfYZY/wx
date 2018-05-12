var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    load: false,
    query: {
      fields: [],
      wheres: [
        {
          value: "userId",
          opertionType: "equal",
          opertionValue: wx.getStorageSync("app").sunwouId
        },

        {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        },
        {
          value: "type",
          opertionType: "equal",
          opertionValue: '充值'
        }
      ],
      sorts: [{ value: 'status', asc: false }, { value: 'createTime', asc: false }],
      pages: {
        currentPage: 1,
        size: 10
      }
    }
  },
  gotoOrder() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  previewOrder(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders(0)
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
          list: li,
          
        })
      } else {
        that.setData({
          load: false
        })
      }
    })
  },

  onPullDownRefresh: function () {
    this.getOrders(0)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.list) {
      this.getOrders(1)
    }


  },

})