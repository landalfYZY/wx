//index.js
//获取应用实例
var app = getApp()
var that;
var util = require('../../utils/util.js')
Page({
  data: {
    carCurrent:0,
    hot:[],
    tui:[],
    page:1,
    size:10,
    list:[]
  },
  currentChange(e){
    this.setData({
      carCurrent:e.detail.current
    })
  },
  navToDetail(e){
    wx.navigateTo({
      url: '/pages/detail/detail?id='+e.currentTarget.dataset.id,
    })
  },
  onLoad: function () {
    that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width:res.screenWidth
        })
      },
    })

    this.getHot1();
    this.getList(0)
  },
  getHot1(){
    util.get('hot/findByType', { type:'selectGoods2'},function(res){
        that.setData({
          hot: res.data
        })
      util.get('hot/findByType', { type: 'selectGoods1' }, function (res) {
        that.setData({
          tui: res.data
        })

      })
    })
  },
  getList(num){
    if(num == 1){
      this.data.page += 1
    }else{
      this.data.page = 1
    }
    util.post('goods/finds',{
      wheres:'isdelete=0 and issale=1',
      orderby:'createTime desc',
      page:this.data.page,
      size:this.data.size
    },function(res){
      if(res.code){
        var da = [];
        if(num == 1){
          da = this.data.list;
          for(var i in res.data.data){
            da.push(res.data.data[i])
          }
        }else{
          da = res.data.data
        }
        that.setData({
          list:da
        })
      }
    })
  } ,
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(0)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path:'/pages/index/index',
      title:''
    }
  }
})
