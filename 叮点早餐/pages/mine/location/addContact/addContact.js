var app = getApp();
var that;

Page({

  data: {
    floorName: '请选择该校楼栋',
    floors: [],
    floorId: '',
    schoolFloors: [],
    contactPerson: '',
    contactPhone: '',
    contactDoor: '',
    setDefault: false,
  },

  onLoad: function(options) {
    that = this
  },

  onShow: function() {
    that.findFloors();
    that.bianJiAddress()
  },

  //获取该校所有楼栋
  findFloors: function() {
    var query = {
      wheres: [{
        value: "schoolId",
        opertionType: "equal",
        opertionValue: app.globalData.school.sunwouId
      }, {
        value: "isDelete",
        opertionType: "equal",
        opertionValue: false
      }],
      fields: ['name', 'sunwouId']
    }
    //获取楼栋地址
    app.post('/floor/find', {
      query: JSON.stringify(query)
    }, function(res) {
      if (res.data.code) {
        for (let i = 0; i < res.data.params.floors.length; i++) {
          that.data.schoolFloors.push(res.data.params.floors[i].name);
        }
        that.setData({
          schoolFloors: that.data.schoolFloors,
          floors: res.data.params.floors
        })
      }
    })
  },

  //判断是否有默认地址或者是从编辑进入的
  bianJiAddress: function() {
    if (wx.getStorageSync("bianJiAddress")) {
      if (wx.getStorageSync("defaultAddress")) {
        if (wx.getStorageSync("defaultAddress").sunwouId == wx.getStorageSync("bianJiAddress").sunwouId) {
          that.setData({
            'setDefault': true
          })
        }
      }
      that.setData({
        contactPerson: wx.getStorageSync("bianJiAddress").concatName,
        contactPhone: wx.getStorageSync("bianJiAddress").concatPhone,
        floorName: wx.getStorageSync("bianJiAddress").floorName,
        contactDoor: wx.getStorageSync("bianJiAddress").detail,
        floorId: wx.getStorageSync("bianJiAddress").floorId
      })
    }
  },

  //选择楼栋
  bindPickerChange: function(e) {
    that.setData({
      floorName: that.data.schoolFloors[e.detail.value],
      floorId: that.data.floors[e.detail.value].sunwouId
    })
  },

  //联系人
  contactPersonInput: function(e) {
    that.data.contactPerson = e.detail.value
  },

  //联系方式
  contactPhoneInput: function(e) {
    that.data.contactPhone = e.detail.value
  },

  //门牌号码
  contactDoorInput: function(e) {
    that.data.contactDoor = e.detail.value
  },

  //默认地址的选择
  setDefault: function(e) {
    that.setData({
      'setDefault': e.detail.value
    })
  },

  //点击保存
  saveAddress: function() {
    if (that.data.contactPerson == "" || that.data.contactPhone == "" || that.data.contactDoor == "" || that.data.floorName == "请选择该校楼栋") {
      wx.showToast({
        title: "未填完整信息",
        image: '/images/tanHao.png',
        duration: 2000,
        mask: true
      })
    } else if (wx.getStorageSync("bianJiAddress")) {
      app.post('/address/update', {
        sunwouId: wx.getStorageSync("bianJiAddress").sunwouId,
        userId: app.globalData.user.sunwouId,
        schoolId: app.globalData.school.sunwouId,
        schoolName: app.globalData.school.schoolName,
        floorId: that.data.floorId,
        floorName: that.data.floorName,
        concatName: that.data.contactPerson,
        concatPhone: that.data.contactPhone,
        detail: that.data.contactDoor
      }, function(res) {
        if (res.data.code) {
          if (wx.getStorageSync("bianJiAddress").sunwouId == wx.getStorageSync("defaultAddress").sunwouId) {
            if (that.data.setDefault) {
              wx.removeStorageSync('defaultAddress')
              wx.setStorageSync('defaultAddressId', wx.getStorageSync("bianJiAddress").sunwouId)
            } else {
              wx.removeStorageSync('defaultAddress')
            }
          } else {
            if (that.data.setDefault) {
              wx.removeStorageSync('defaultAddress')
              wx.setStorageSync('defaultAddressId', wx.getStorageSync("bianJiAddress").sunwouId)
            } else {}
          }
          wx.removeStorageSync('bianJiAddress')
          wx.navigateBack({
            delta: 1, 
          })
        }
      })
    } else {
      app.post('/address/add', {
        userId: app.globalData.user.sunwouId,
        schoolId: app.globalData.school.sunwouId,
        schoolName: app.globalData.school.schoolName,
        floorId: that.data.floorId,
        floorName: that.data.floorName,
        concatName: that.data.contactPerson,
        concatPhone: that.data.contactPhone,
        detail: that.data.contactDoor
      }, function(res) {
        if (res.data.code) {
          if (that.data.setDefault && wx.getStorageSync("defaultAddress")) {
            wx.removeStorageSync('defaultAddress')
            wx.setStorageSync('addressLength', true)
          } else if (that.data.setDefault && !wx.getStorageSync("defaultAddress")) {
            wx.setStorageSync('addressLength', true)
          } else {

          }
          wx.navigateBack({
            delta: 1, 
          })
        }
      })
    }
  },

  onReady: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})