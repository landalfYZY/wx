//index.js
//获取应用实例
const sliderWidth = 110;
const app = getApp();
let that;

Page({
  data: {
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    tabs: ["全部", "普通", "快递", "外卖"],
    school: {},
    orderlist: [],
    subType: "全部",
  },
  getswiperimg: function (e) {
    let school = wx.getStorageSync("school");
    if (school != undefined && school != null) {
      let query = {
        sorts: [
          { value: 'createTime', asc: false }
        ],
        wheres: [{
          value: 'schoolId', opertionType: 'equal', opertionValue: school.sunwouId
        }, {
          value: 'isDelete', opertionType: 'equal', opertionValue: false
        }]
      }
      app.post("/carousel/find", { query: JSON.stringify(query) }, function (res) {
        if (res.code) {
          if (res.params.carousels.length > 0) {
            that.setData({
              swiperimg: res.params.carousels
            })
          }
        } else {
          that.showFailToast(res.msg, 2000);
        }
      })
    }
  },
  navschoolselect: function (e) {
    wx.navigateTo({
      url: '/pages/schoolselect/schoolselect',
    })
  },
  cilckorderitem: function (e) {
    let sunwouId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderscan/orderscan?sunwouId=' + sunwouId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  getorderlist: function (page) {
    let school = that.data.school;
    let query = {
      sorts: [
        { value: 'createTime', asc: false }
      ],
      wheres: [{
        value: "schoolId", opertionType: "equal", opertionValue: school.sunwouId
      }, {
        value: "type", opertionType: "equal", opertionValue: "跑腿订单"
      }, {
        value: 'status', opertionType: 'ne', opertionValue: '待付款'
      }, {
        value: 'status', opertionType: 'ne', opertionValue: '已取消'
      }]
    }
    if (that.data.subType != "全部") {
      query.wheres.push({ value: "subType", opertionType: "equal", opertionValue: that.data.subType })
    }
    app.post("/order/find", { query: JSON.stringify(query) }, function (res) {
      if (res.code) {
        let orderlist = res.params.orders;
        orderlist.forEach(function (item, index) {
          app.timediffnow(item)
        })
        that.setData({
          orderlist: orderlist
        })
      }
    })
  },
  naveditorder: function (e) {
    let userInfo = app.globalData.userInfo;
    if (userInfo.phone == undefined || userInfo == "" || userInfo == null) {
      app.showModel("提示", "检测到您还未绑定手机，是否前去绑定手机？", function (res) {
        wx.navigateTo({
          url: '/pages/bindphone/bindphone',
        })
      })
    } else {
      wx.navigateTo({
        url: '/pages/editorder/editorder',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },
  tabClick: function (e) {
    let activeIndex = e.currentTarget.id;
    let subType = "";
    if (activeIndex == 0) {
      subType = "全部";
    } else if (activeIndex == 1) {
      subType = "普通";
    } else if (activeIndex == 2) {
      subType = "快递";
    } else {
      subType = "外卖";
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: activeIndex,
      subType: subType
    });
    that.getorderlist();
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
  updateUserInfo: function () {
    let that = this;
    let updateUserInfo = {
      sunwouId: app.globalData.userInfo.sunwouId,
      schoolId: that.data.school.sunwouId,
      floorId: that.data.floor.sunwouId
    }
    app.post("/user/update", updateUserInfo, function (res) {
      if (res.code) {
        app.globalData.userInfo = res.params.user
      }
    })
  },
  regschool: function () {
    let school = wx.getStorageSync("school");
    if (school == undefined || school == null || school == "") {
      that.navschoolselect();
    } else {
      that.setData({
        school: school
      })
      let floor = wx.getStorageSync("floor");
      if (floor == undefined || floor == null || floor == "") {
        wx.navigateTo({
          url: '/pages/floorselect/floorselect?schoolId=' + school.sunwouId,
        })
      } else {
        that.setData({
          floor: floor
        })
        let userInfo = app.globalData.userInfo
        console.info(userInfo)
        if (userInfo.schoolId == undefined || userInfo.schoolId != school.sunwouId || userInfo.floorId == undefined || userInfo.floorId != floor.sunwouId) {
          that.updateUserInfo();
        }
      }
    }

  },
  onLoad: function () {
    that = this;
    that.getSystemInfo();
    that.getswiperimg();
  },
  onShow: function () {
    that.regschool();
    that.getorderlist();
    if (that.data.swiperimg == undefined) {
      that.getswiperimg();
    }
  },

})
