const app = getApp()
var com = require('../../utils/common.js')
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    load:false,
    total:0,
    query: {
      fields: [],
      wheres: [
        { value: "isDelete", opertionType: "equal", opertionValue: false }
      ],
      sorts: [{ value: "sort", asc: false }],
      pages: {
        currentPage: 1,
        size: 10
      }
    },
    list:[]
  },
  pay(e){
    com.pay(e.currentTarget.dataset.id, "微信支付","navigateTo")
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  navToDetail(e){
    com.wxNavgiteTo(e.currentTarget.dataset.navurl, ["id"], e.currentTarget.dataset)
  },

  onShow: function () {
    that.getOrder(0)
  },

  getOrder(num){
    this.setData({load:true})
    if(num == 0){
      this.data.query.pages.currentPage = 1;
    }else{
      this.data.query.pages.currentPage += 1;
    }
    com.post('order/find',{
      query: JSON.stringify(this.data.query)
    },function(res){
      wx.stopPullDownRefresh();
      if(res.code){
        for(var i in res.params.msg){
          switch (res.params.msg[i].status){
            case "待付款": res.params.msg[i].style=0; break; 
            case "待接手": res.params.msg[i].style = 1; break;
            case "制作中": res.params.msg[i].style = 2; break;
            case "待取货": res.params.msg[i].style = 3; break;
            case "交易完成": res.params.msg[i].style = 4; break;
            case "已取消": res.params.msg[i].style = 5; break;
          }
        }
        var li = that.data.list;
        if(num == 0){
          li = res.params.msg;
        }else{
          for (var i in res.params.msg) {
            li.push(res.params.msg[i])
          }
        }
        
        that.setData({
          load: false,
          list: li,
          total:res.params.total
        })
      }
      
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrder(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.total > this.data.list.length){
      this.getOrder(1);
    }
  },
})