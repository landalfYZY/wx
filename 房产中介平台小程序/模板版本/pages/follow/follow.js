var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:false,
    fil: [
      '全部', '二手房', '新房', '租房'
    ],
    filflag:0,
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
          value: "wxUserId",
          opertionType: "equal",
          opertionValue: wx.getStorageSync('app').sunwouId
        }
      ],
      sorts: [],
      pages: {
        currentPage: 1,
        size: 10
      }
    },
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(1);
  },
  filter(e) {
    this.setData({
      filflag:e.currentTarget.dataset.index
    })
    var temp = -1;
    for(var i in this.data.query.wheres){
      if (this.data.query.wheres[i].value == "remark1"){
        temp = i
      }
    }
    if(temp == -1){
      if (e.currentTarget.dataset.index != 0){
        this.data.query.wheres.push({ value: 'remark1', opertionType: 'equal', opertionValue: this.data.fil[e.currentTarget.dataset.index] })
      }
    }
    if (e.currentTarget.dataset.index == 0){
      if (e.currentTarget.dataset.index == 0){
        this.data.query.wheres.splice(temp,1)
      }else{
        this.data.query.wheres[temp].opertionValue = this.data.fil[e.currentTarget.dataset.index]
      }
    }
    this.getList(1)
  },
  navToDetail(e) {
    var str = '/pages/'
    if (e.currentTarget.dataset.name == '二手房') {
      str += 'houseDetail/houseDetail?id=' + e.currentTarget.dataset.id
    } else if (e.currentTarget.dataset.name == '新房') {
      str += 'newDetail/newDetail?id=' + e.currentTarget.dataset.id
    } else if(e.currentTarget.dataset.name == '租房'){
      str += 'detail/detail?id=' + e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: str,
    })
  },
  getList(ty){
    var that = this;
    this.setData({
      load:true
    })
    app.post('collection/find', {
      query: JSON.stringify(this.data.query)
    }, function (res) {
      if (res.code) {
        for(var i in res.params.result){
          res.params.result[i].table = JSON.parse(res.params.result[i].table)
          res.params.result[i].table.config.tag = JSON.parse(res.params.result[i].table.config.tag)
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
          list:li,
          total:res.params.total,
          load:false
        })
      }
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