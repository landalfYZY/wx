var app = getApp();
var china = require('../../utils/area.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
    load: false,
    fwType: 1,
    pageFlag: 3,
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
          opertionValue: '二手房'
        },
       {
          value: "config.wxuid",
          opertionType: "equal",
          opertionValue: wx.getStorageSync("app").sunwouId
        },

      ],
      sorts: [],
      pages: {
        currentPage: 1,
        size: 10
      }
    },
    showModel: false,
    screenFlag: 0,
    list: [],
    total: 0,
    search: ''
  },
  navToHo(e){
    wx.navigateTo({
      url: '/pages/pubhouse/pubhouse?id=' + e.currentTarget.dataset.id,
    })
  },
  navToDetail(e) {
    wx.navigateTo({
      url: '/pages/houseDetail/houseDetail?id=' + e.currentTarget.dataset.id
    })
  },
  navToUpd(e){
    var that = this
    var str = '下架后将无法进行上架操作，确定要继续？'
    var data = {
      sunwouId: e.currentTarget.dataset.id
    }
    if (e.currentTarget.dataset.cz == '下架'){
      data.remark2 = e.currentTarget.dataset.cz
    }else{
      str = "删除后将无法进行上架操作，确定要继续？"
      data.isDelete = true
    }
    wx.showModal({
      title: '提示',
      content: str,
      success(res){
        if(res.confirm){
          app.post('exh/update',data,function(res){
            if (res.code) {
              wx.showToast({
                title: '操作成功',
              })
              that.getList(1);
            } else {
             
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    /**
     * 所有参数必须声明变量，一个方法里只能出现一个setData
     */
    var that = this;


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

})