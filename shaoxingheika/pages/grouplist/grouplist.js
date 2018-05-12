// pages/grouplist/grouplist.js
const sliderWidth = 110;
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: [],
    lastweekranklist:[],
    allranklist:[],
    haveMore: false,
    ip: "",
    tabs: ["上周top", "总top"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  getgrouplastweekrank() {
    app.post("HuangCardPingTuan/userinfo/findRank.do", {
      countGroupLastWeek: "countGroupLastWeek"
    }, function (res) {
      if (res.code) {
        that.setData({
          lastweekranklist: res.params.list
        })
      } else {
        app.showFailToast("获取总排名失败！", 2000);
      }

    })
  },
  getgrouprank() {
    app.post("HuangCardPingTuan/userinfo/findRank.do", {
      countGroup: "countGroup"
    }, function (res) {
      if (res.code) {
        that.setData({
          allranklist: res.params.list
        })
      } else {
        app.showFailToast("获取总排名失败！", 2000);
      }


    })
  },
  getgrouplist(page) {
    app.post("HuangCardPingTuan/groupinfo/findYouWant.do", {
      page: page,
      size: app.pageSize,
      isable: true,
      gr_online: true
    }, function (res) {
      console.info(res);
      if (res.code && res.params != undefined && res.params.list != undefined && res.params.list.length > 0) {
        let list = page > 1 ? that.data.list.concat(res.params.list) : res.params.list;
        let haveMore = list.length >= app.pageSize ? true : false;
        that.setData({
          list: list,
          haveMore: haveMore,
          page: res.params.page
        })
      }

    })
  },
  navtogrooupbuy: function (e) {
    let gr_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/groupinfo/groupinfo?id=' + gr_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getSystemInfo();
    // that.getgrouplist(1);
    that.setData({
      ip: app.ip
    })
    that.getgrouprank();
    that.getgrouplastweekrank();
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
    // if (that.data.haveMore) {
    //   that.getgrouplist(that.data.page + 1)
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})