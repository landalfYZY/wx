var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:false,
    showHistory:true,
    history:[],
    list:[],
    search:'',
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
          value: "remark2",
          opertionType: "equal",
          opertionValue: '上架'
        },
      ],
      sorts: [],
      pages: {
        currentPage: 1,
        size: 10
      }
    },
    total:0
  },
  navToDetail(e) {
    var str = '/pages/'
    if (e.currentTarget.dataset.name == '二手房') {
      str += 'houseDetail/houseDetail?id=' + e.currentTarget.dataset.id
    } else if (e.currentTarget.dataset.name == '新房') {
      str += 'newDetail/newDetail?id=' + e.currentTarget.dataset.id
    } else {
      str += 'detail/detail?id=' + e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: str,
    })
  },
  clearHistory(){
    var that = this;
    wx.showModal({
      title: '警告',
      content: '清空将无法恢复，确定要清空？',
      success(res){
        if(res.confirm){
          wx.removeStorageSync("history");
          that.setData({
            history:[]
          })
        }
      }
    })
    
  },
  searchInput(e){
    this.setData({
      search:e.detail.value
    })
  },
  doSearch(){

    var temp = -1;
    for(var i in this.data.query.wheres){
      if (this.data.query.wheres[i].value == 'title'){
        temp = i
      }
    }
    if(temp == -1){
      if (this.data.search != ''){
        this.data.query.wheres.push({ value: 'title', opertionType: 'like', opertionValue: this.data.search })
      }
    }else{
      if (this.data.search == ''){
        this.data.query.wheres.splice(temp,1)
      }else{
        this.data.query.wheres[temp].opertionValue = this.data.search
      }
    }
    if(this.data.search != ''){
      this.getList(1)
    }
  },
  chooseHistory(e){
    this.setData({
      search:e.currentTarget.dataset.his
    })
    this.doSearch()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory()
  },
  getHistory(){
    if (wx.getStorageSync("history")){
      this.setData({
        history: wx.getStorageSync("history")
      })
    }
  },
  searchFocus(){
    this.setData({
      showHistory:true
    })
    this.getHistory()
  },
  getList(ty) {
    this.setData({
      load: true,
      showHistory:false
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
        var his = [];
        if (wx.getStorageSync("history")){
          his = wx.getStorageSync("history");
        }

        if(res.params.result.length>0){
          var tm = -1
          for(var i in his){
            if(his[i] == that.data.search){
              tm = i
            }
          }
          if(tm == -1){
            his.push(that.data.search)
          }
        }
        wx.setStorageSync('history', his)
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