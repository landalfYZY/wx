var util = require("../../utils/util.js");
var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:false,
    type:1,
    current: 'tab1',
    query:{
      fields: [],
      wheres: [{ value: "isDelete", opertionType: "equal", opertionValue: false }, { value: "userId", opertionType: "equal", opertionValue: wx.getStorageSync("user").sunwouId }],
      sorts: [{ value: "createTime", asc: false }],
      pages: {
        currentPage: 1,
        size: 10
      }
    }
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      type:options.id
    })
    this.getList(0)
  },
  getList(num) {
    this.setData({
      load: true
    })
    if (num == 0) {
      this.data.query.pages.currentPage = 1
    } else {
      this.data.query.pages.currentPage += 1
    }
    util.post('activity/find', {
      query: JSON.stringify(this.data.query)
    }, function (res) {
      var data = null;
      if (num == 0) {
        data = res.params.msg;
      } else {
        data = that.data.list;
        for (var i in res.params.msg) {
          data.push(res.params.msg[i])
        }
      }
      that.setData({
        list: data,
        load: false
      })
    })
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(0);
    wx.stopPullDownRefresh();
  },
  showAc(e){
    wx.showActionSheet({
      itemList: ['查看', '编辑', '删除'],
      success: function (res) {
        console.log(res.tapIndex)
        switch (res.tapIndex){
          case 0: wx.navigateTo({ url: '/pages/activity/activity?id='+e.currentTarget.dataset.id});break;
          case 1: wx.navigateTo({ url: '/pages/public/public?id=' + e.currentTarget.dataset.id });break;
          case 2:wx.showModal({
            title: '提示',
            content: '删除后将无法恢复，确定要删除吗？',
            success(res){
              util.post("activity/update",{
                ids: e.currentTarget.dataset.id,
                isDelete: true
              },function(res){
                if(res.code){
                  that.getList(0)
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList(1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})