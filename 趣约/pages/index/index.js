var util = require('../../utils/util.js');
const app = getApp()
var that ;
Page({
  data: {
    load:false,
    filter:[
      {label:'类型',flag:0,data:['全部','运动','聚会','旅游','相亲','打球'],initLabel:'类型'},
      { label: '状态', flag: 0, data: ['全部', '报名中', '进行中', '以结束'], initLabel: '状态'},
      { label: '人数', flag: 0, data: ['全部', '3人以下', '4', '5', '6', '7', '8', '9', '10', '11人以上'], initLabel:'人数'},
      { label: '性别', flag: 0, data: ['全部', '限男性', '限女性'], initLabel:'性别' },
      { label: '天数', flag: 0, data: ['全部', '1', '2','3','4','5','6天以上'] ,initLabel:'天数'},
    ],
    list:[],
    query:{
      fields:[],
      wheres: [{ value: "isDelete", opertionType: "equal", opertionValue: false }],
      sorts: [{ value: "createTime", asc: false }],
      pages:{
        currentPage: 1,
        size: 10
      }
    }
  },
  navToD(e){
    wx.navigateTo({
      url: '/pages/activity/activity?id='+e.currentTarget.dataset.id,
    })
  },
  pickerChange(e){
    var index = e.currentTarget.dataset.index;
    var filter = this.data.filter;
    filter[index].flag = e.detail.value;
    if(index == 0){
      filter[index].label = filter[index].initLabel
    }else{
      filter[index].label = filter[index].data[filter[index].flag]
    }
    this.setData({
      filter: filter
    })
  },
  onLoad: function () {
      that = this;
      this.getList(0);
  },
  navToDetail(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },
  getList(num){
    this.setData({
      load:true
    })
    if(num == 0){
      this.data.query.pages.currentPage = 1
    }else{
      this.data.query.pages.currentPage += 1
    }
    util.post('activity/find',{
      query:JSON.stringify(this.data.query)
    },function(res){
      var data = null;
      if(num == 0){
        data = res.params.msg;
      }else{
        data = that.data.list;
        for(var i in res.params.msg){
          data.push(res.params.msg[i])
        }
      }
      that.setData({
        list:data,
        load:false
      })
    })
  },
  onPullDownRefresh(){
    that.getList(0);
    wx.stopPullDownRefresh();
  },
  onReachBottom(){
    this.getList(1);
  },
  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {
    return {
      title:'趣玩吧，一起去玩吧！',
      path:'/pages/index/index'
    }
  }
})
