var app = getApp();
var china = require('../../utils/area.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
    load:false,
    pageFlag: 3,
    city: [],
    priceList: [
      { label: '不限', opt: [], active: true },
      { label: '200万以下', opt: [{ opertionType: 'lte', opertionValue: 200 }], active: false },
      { label: '200-300万', opt: [{ opertionType: 'gt', opertionValue: 200 }, { opertionType: 'lte', opertionValue: 300 }], active: false },
      { label: '300-400万', opt: [{ opertionType: 'gt', opertionValue: 300 }, { opertionType: 'lte', opertionValue: 400 }], active: false },
      { label: '400-500万', opt: [{ opertionType: 'gt', opertionValue: 400 }, { opertionType: 'lte', opertionValue: 500 }], active: false },
      { label: '500-800万', opt: [{ opertionType: 'gt', opertionValue: 500 }, { opertionType: 'lte', opertionValue: 800 }], active: false },
      { label: '800-1000万', opt: [{ opertionType: 'gt', opertionValue: 800 }, { opertionType: 'lte', opertionValue: 1000 }], active: false },
      { label: '1000-2000万', opt: [{ opertionType: 'gt', opertionValue: 1000 }, { opertionType: 'lte', opertionValue: 2000 }], active: false },
      { label: '2000万以上', opt: [{ opertionType: 'gt', opertionValue: 2000 }], active: false }
    ],
    huxin: [
      { label: '不限', opt: [], active: true },
      { label: '住宅', opt: [{ opertionType: 'equal', opertionValue: '住宅' }], active: false },
      { label: '别墅', opt: [{ opertionType: 'equal', opertionValue: '别墅' }], active: false },
      { label: '写字楼', opt: [{ opertionType: 'equal', opertionValue: '写字楼' }], active: false },
      { label: '商铺', opt: [{ opertionType: 'equal', opertionValue: '商铺' }], active: false },
      { label: '底商', opt: [{ opertionType: 'equal', opertionValue: '底商' }], active: false }
    ],
    screenTitle: [
      { label: '区域', active: false },
      { label: '售价', active: false },
      { label: '房型', active: false },
      { label: '更多', active: false }
    ],
    chaoxiang: [
      { label: '不限', opt: [], active: true },
      { label: '优惠楼盘', opt: [{ opertionType: 'equal', opertionValue: '优惠楼盘' }], active: false },
      { label: '低密度', opt: [{ opertionType: 'equal', opertionValue: '低密度' }], active: false },
      { label: '花园洋房', opt: [{ opertionType: 'equal', opertionValue: '花园洋房' }], active: false },
      { label: '车位充足', opt: [{ opertionType: 'equal', opertionValue: '车位充足' }], active: false }
    ],
    
    zhuangxiu: [
      { label: '不限', opt: [], active: true },
      { label: '在售', opt: [{ opertionType: 'equal', opertionValue: '毛坯房' }], active: false },
      { label: '待售', opt: [{ opertionType: 'equal', opertionValue: '普通装修' }], active: false },
      { label: '停售', opt: [{ opertionType: 'equal', opertionValue: '精装修' }], active: false },
    ],

    query: {
      fields: [],
      wheres: [
        {
          value: "miniId",
          opertionType: "equal",
          opertionValue: app.id
        },
        {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        },
        {
          value: "remark1",
          opertionType: "equal",
          opertionValue: '新房'
        },
      ],
      sorts: [],
      pages: {
        currentPage: 1,
        size: 10
      },
    },
    showModel: false,
    screenFlag: 0,
    search:''
  },

  searchInput(e) {
    var that = this;
    var temp = -1;
    for (var i in this.data.query.wheres) {
      if (this.data.query.wheres[i].value == 'title') {
        temp = i
      }
    }
    if (temp == -1) {
      this.data.query.wheres.push({ value: 'title', opertionType: 'like', opertionValue: e.detail.value })
    } else {
      this.data.query.wheres[i].opertionValue = e.detail.value
    }
    this.getList(1)
  },
  navToDetail(e) {
    wx.navigateTo({
      url: '/pages/newDetail/newDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  tempData() {
    var that = this;
    this.data.screenTitle[3].active = false
    this.setData({
      showModel: false,
      screenTitle: that.data.screenTitle
    })
    this.getList(1)
  },

  reset() {
    var that = this;
    if (this.data.screenFlag == 2) {
      for (var i in that.data.huxin) {
        that.data.huxin[i].active = false;
      }
      that.setData({
        screenTitle: that.data.screenTitle,
        huxin: that.data.huxin
      })
    } else if (this.data.screenFlag == 3) {
      for (var i in that.data.chaoxiang) {
        that.data.chaoxiang[i].active = false;
      }
      that.data.chaoxiang[0].active = true;
      for (var i in that.data.zhuangxiu) {
        that.data.zhuangxiu[i].active = false;
      }
      that.data.zhuangxiu[0].active = true
      var temp = []
      for (var i in this.data.query.wheres) {
        if (this.data.query.wheres[i].value == "config.floorType" || this.data.query.wheres[i].value == "config.status" ) {
          temp.push(i)
        }
      }

      for (var i = temp.length - 1; i >= 0; i--) {
        this.data.query.wheres.splice(temp[i], 1)
      }

      that.setData({
        chaoxiang: that.data.chaoxiang,
        mianji: that.data.mianji,
        zhuangxiu: that.data.zhuangxiu,
        dianti: that.data.dianti,
        czfs: that.data.czfs
      })
    }

  },
  chooseSimItem(e) {
    var that = this;

    for (var i in that.data[e.currentTarget.dataset.name]) {
      that.data[e.currentTarget.dataset.name][i].active = false;
    }
    that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].active = true;

    if (e.currentTarget.dataset.name == 'city') {
      var temp = -1;
      for (var i in this.data.query.wheres) {
        if (this.data.query.wheres[i].value == 'config.areas') {
          temp = i
        }
      }
      that.data.screenTitle[0].active = false;
      if (that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label == '不限') {
        that.data.screenTitle[0].label = '区域'
        if (temp != -1) {
          this.data.query.wheres.splice(temp, 1)
        }
      } else {
        if (temp == -1) {
          this.data.query.wheres.push({ value: 'config.areas', opertionType: 'equal', opertionValue: that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label })
        } else {
          this.data.query.wheres[i].opertionValue = that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label
        }
        that.data.screenTitle[0].label = that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label;
      }
    }

    if (e.currentTarget.dataset.name == 'priceList') {
      var temp = []
      for (var i in this.data.query.wheres) {
        if (this.data.query.wheres[i].value == 'minPrice') {
          temp.push(i)
        }
      }
      that.data.screenTitle[1].active = false;

      if (that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label == '不限') {
        if (temp.length > 0) {
          for (var i = temp.length - 1; i >= 0; i--) {
            this.data.query.wheres.splice(temp[i])
          }
        }
        that.data.screenTitle[1].label = '售价'
      } else {

        for (var i = temp.length - 1; i >= 0; i--) {
          this.data.query.wheres.splice(temp[i])
        }
        for (var i in that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].opt) {
          this.data.query.wheres.push({ value: 'minPrice', opertionType: that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].opt[i].opertionType, opertionValue: that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].opt[i].opertionValue })
        }

        that.data.screenTitle[1].label = that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label;
      }
    }

    that.setData({
      screenTitle: that.data.screenTitle,
      showModel: false,
      city: that.data.city,
      priceList: that.data.priceList
    })
    this.getList(1)
  },

  chooseMulItem(e) {
    var that = this;
    that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].active = !that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].active;
    that.setData({
      huxin: that.data.huxin,
      chaoxiang: that.data.chaoxiang,
      mianji: that.data.mianji,
      zhuangxiu: that.data.zhuangxiu
    })
  },

  chooseSItem(e) {
    var val = null;
    if (e.currentTarget.dataset.name == 'huxin') { val = 'decorate' }
    if (e.currentTarget.dataset.name == 'chaoxiang') { val = 'floorType' }
    if (e.currentTarget.dataset.name == 'zhuangxiu') { val = 'status' }
    var that = this;
    for (var i in that.data[e.currentTarget.dataset.name]) {
      that.data[e.currentTarget.dataset.name][i].active = false;
    }
    that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].active = true;
    var temp = -1;
    for (var i in this.data.query.wheres) {
      if (this.data.query.wheres[i].value == ('config.' + val)) {
        temp = i;
      }
    }
    if (that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label == '不限') {
      if (this.data.screenFlag == 2) {
        this.data.screenTitle[2].label = "房型"
      }
      if (temp != -1) {
        this.data.query.wheres.splice(temp, 1)
      }
    } else {
      if (this.data.screenFlag == 2) {
        this.data.screenTitle[2].label = that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label
      }
      if (temp == -1) {
        this.data.query.wheres.push({ value: 'config.' + val, opertionType: 'equal', opertionValue: that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label })
      } else {
        this.data.query.wheres[temp].opertionValue = that.data[e.currentTarget.dataset.name][e.currentTarget.dataset.index].label;
      }
    }
    var sm = true
    if (this.data.screenFlag == 2) {
      this.data.screenTitle[2].active = false;
      sm = false;
      this.getList(1)
    }
    that.setData({
      screenTitle: that.data.screenTitle,
      showModel: sm,
      huxin: that.data.huxin,
      chaoxiang: that.data.chaoxiang,
      zhuangxiu: that.data.zhuangxiu,
    })


  },

  openScreen(e) {
    var that = this;
    var shm = true;
    if (that.data.screenTitle[e.currentTarget.dataset.index].active) {
      that.data.screenTitle[e.currentTarget.dataset.index].active = false;
      shm = false;
    } else {
      shm = true;
      for (var i in that.data.screenTitle) {
        that.data.screenTitle[i].active = false
      }
      that.data.screenTitle[e.currentTarget.dataset.index].active = true;
    }
    that.setData({
      showModel: shm,
      screenTitle: that.data.screenTitle,
      screenFlag: e.currentTarget.dataset.index
    })
  },

  closeScreen() {
    var that = this
    for (var i in this.data.screenTitle) {
      this.data.screenTitle[i].active = false
    }
    this.setData({
      screenTitle: that.data.screenTitle,
      showModel: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 所有参数必须声明变量，一个方法里只能出现一个setData
     */
    var that = this;


    //获取城市数据
    var city = [];
    city.push({ label: '不限', active: true })
    for (var i in china.getAreaSim(wx.getStorageSync('city'))) {
      city.push({ label: china.getAreaSim(wx.getStorageSync('city'))[i], active: false })
    }
    this.data.query.wheres.push({
      value: "config.city",
      opertionType: "equal",
      opertionValue: wx.getStorageSync('city')
    })
    wx.getSystemInfo({
      success: function (res) {
        //统一渲染数据
        that.setData({
          height: res.screenHeight,
          city: city
        })
      },
    })
    this.getList(1);
  },
  getList(ty) {
    wx.showNavigationBarLoading()
    this.setData({
      load: true
    })
    var that = this;
    if (ty == 2) {
      this.data.query.pages.currentPage += 1;
    }
    if (ty == 1) {
      this.data.query.pages.currentPage = 1;
    }
    app.post('exh/find', { query: JSON.stringify(this.data.query) }, function (res) {
      if (res.code) {
        for (var i in res.params.result) {
          res.params.result[i].config.cover = res.params.result[i].config.cover.replace('-', '-thumbnail')
          res.params.result[i].images = JSON.parse(res.params.result[i].images)
          res.params.result[i].config.tag = JSON.parse(res.params.result[i].config.tag)
        }
        var li = [];
        if (ty == 1) {
          li = res.params.result
        } else {
          li = that.data.list;
          for (var i in res.params.result) {
            li.push(res.params.result[i])
          }
        }
        that.setData({
          list: li,
          total: res.params.total,
          load: false
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 800
        })
      }
      wx.hideNavigationBarLoading()
    })
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
    this.getList(1)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.list.length < this.data.total) {
      this.getList(2)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '知己新房',
      path: '/pages/new/new',
      imageUrl: '/img/banner.png'
    }
  }
})