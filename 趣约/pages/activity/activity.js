var util = require('../../utils/util.js');
var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'立即参加',
    id:'',
    msg:{},
    people:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      id:options.id
    })
    this.getMsg()
    util.getWindowSize(this)
  },
  lijican(){
    wx.showLoading({
      title: '系统处理中',
    })
    util.post('activity/takepart',{
      activityId:this.data.id,
      userId:wx.getStorageSync("user").sunwouId
    },function(res){
      wx.hideLoading();
      if(res.code){
        wx.showToast({
          title: '参加成功',
        })
        wx.redirectTo({
          url: '/pages/activity/activity?id='+that.data.id,
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:none
        })
      }
    })
  },
  getMsg(){
    util.post('activity/find',{
      query: JSON.stringify({
        fields: [],
        wheres: [{ value: "sunwouId", opertionType: "equal", opertionValue: this.data.id }],
        sorts: [{ value: "createTime", asc: false }],
        pages: {
          currentPage: 1,
          size: 10
        }
      })
    },function(res){
      if(res.code){
        that.setData({
          msg: res.params.msg[0]
        })
        for (var i in res.params.msg[0].takepartPeople){
          if (wx.getStorageSync("user").sunwouId == res.params.msg[0].takepartPeople[i]){
            that.setData({
              status:'已参加'
            })
          }
        }
        that.checkCan()
      }
    })
  },
  checkCan(){
    util.post('wxuser/find',{
      query:JSON.stringify({
        fields: [], wheres: [{ value: 'sunwouId', opertionType: 'in', opertionValue: this.data.msg.takepartPeople.toString()}],sorts:[],pages:{currentPage:1,size:10000}
      })
    },function(res){
      if(res.code){
        that.setData({
          people: res.params.msg
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:this.data.msg.title,
      path:'/pages/activity/activity?id='+this.data.id
    }
  }
})