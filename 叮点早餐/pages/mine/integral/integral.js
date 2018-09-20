var app = getApp();
var that;

Page({

  data: {
    tabs: [
      { title: '积分兑换', content: '内容一', active: true},
      { title: '兑换纪录', content: '内容二', active: false},
      { title: '获取纪录', content: '内容三', active: false}
    ],
    tab: 0,
    showdetail: false,
    showdetail2: false,
    exchangeGoods: [{
      pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530903196743&di=6b4a31f7a088d7cdd9c3203bde493ef0&imgtype=0&src=http%3A%2F%2Fimg05.tooopen.com%2Fimages%2F20150820%2Ftooopen_sy_139205349641.jpg",
      title:"清风纸巾一排装，兑换后会有专员给您送到寝室后会有专员给您送到寝室",
      num: 57,
      integral: 984
    }, {
      pic: "http://img5.imgtn.bdimg.com/it/u=1677561633,529867622&fm=27&gp=0.jpg",
      title: "英雄联盟压缩皮肤",
      num: 110,
      integral: 1515
      } ],
    exchangeRecords: [{
      pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530903196743&di=6b4a31f7a088d7cdd9c3203bde493ef0&imgtype=0&src=http%3A%2F%2Fimg05.tooopen.com%2Fimages%2F20150820%2Ftooopen_sy_139205349641.jpg",
      title: "清风纸巾一排装，兑换后会有专员给您送到寝室后会有专员给您送到寝室",
      integral: 984,
      time: "2017-12-27 21:37:02",
      state: "已兑换"
    }, {
      pic: "http://img5.imgtn.bdimg.com/it/u=1677561633,529867622&fm=27&gp=0.jpg",
      title: "英雄联盟压缩皮肤",
      integral: 1515,
      time: "2017-12-27 21:37:02",
      state: "兑换中"
    },],
    getIntegral: [{
      title: "消费后评论",
      integral: 984,
      time: "2017-12-27 21:37:02",
    }, {
      title: "消费清风纸巾一排装消费清风纸巾一排装",
      integral: 515,
      time: "2017-12-27 21:37:02",
    },]
  },

  onLoad: function(options) {
    that = this
  },

  onShow: function() {

  },

  // 切换头部
  onClick: function (e) {
    for (var i = 0; i < that.data.tabs.length; i++) {
      that.data.tabs[i].active = false;
    }
    that.data.tabs[e.currentTarget.dataset.index].active = true;
    that.setData({
      tabs: that.data.tabs,
      tab: e.currentTarget.dataset.index
    })
  },

  // 显示积分规则
  integralIule: function() {
    that.setData({
      showdetail: true,
    })
  },

  // 关闭showdetail
  close: function() {
    this.setData({
      showdetail: false,
      showdetail2: false,
    })
  },

  // 点击兑换
  exchange: function () {
    that.setData({
      showdetail2: true,
    })
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
})