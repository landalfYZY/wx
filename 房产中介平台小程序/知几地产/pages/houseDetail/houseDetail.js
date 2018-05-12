var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iss:false,
    followId:'',
    siFollow:false,
    msg: null,
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
          value: "sunwouId",
          opertionType: "equal",
          opertionValue: ''
        },
      ],
      sorts: [],
      pages: {
        currentPage: 1,
        size: 10
      }
    },
    current:1
  },
  switchToHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  preview() {
    var that = this
    var uls = [];
    for (var i in that.data.msg.images) {
      uls.push(that.data.msg.images[i].url)
    }
    wx.previewImage({
      current: that.data.current,
      urls: uls,
    })
  },
  cuerrentChange(e){
    this.setData({
      current:e.detail.current+1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.query.wheres[3].opertionValue = options.id
    this.getList()
    if (options.iss) {
      this.setData({
        iss: true
      })
    }
  },
  addFollow(){
    var that = this;
    app.post('collection/add',{
      wxUserId: wx.getStorageSync('app').sunwouId,
      miniId: app.id,
      tableId:this.data.msg.sunwouId,
      tableName:'Exhibition'
    },function(res){
      if(res.code){
        that.setData({
          followId: res.params.result,
          isFollow:true
        })
      }
    })
  },
  removeFollow(){
    var that = this;
    app.post('collection/remove',{ids:this.data.followId},function(res){
      if (res.code) {
        that.setData({
          followId: '',
          isFollow: false
        })
      }
    })
  },
  getFollow(){
    var that = this;
    app.post('collection/find',{
      query:JSON.stringify({  
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
            },
            {
              value: "tableId",
              opertionType: "equal",
              opertionValue: this.data.msg.sunwouId
            },
          ],
          sorts: [],
          pages: {
            currentPage: 1,
            size: 10
          }
      })
    },function(res){
      if(res.code){
        if(res.params.result.length>0){
          that.setData({
            followId:res.params.result[0].sunwouId,
            isFollow: true
          })
        }else{
          that.setData({
            isFollow: false
          })
        }
      }
    })
  },
  openLocation() {
    wx.openLocation({
      latitude: this.data.msg.config.lat,
      longitude: this.data.msg.config.lng,
      scale: 28,
      address: this.data.msg.config.city +
      this.data.msg.config.areas +
      this.data.msg.config.address,
    })
  },
  makephoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.msg.config.phone,
    })
  },
  getList(){
    var that = this;
    app.post('exh/find', { query: JSON.stringify(this.data.query) },function(res){
      if (res.code) {
        res.params.result[0].images = JSON.parse(res.params.result[0].images)
        res.params.result[0].config.listingDate = res.params.result[0].config.listingDate.substring(0,10)
        var thosres = res.params.result[0]
        if (res.params.result[0].wxuid){
          that.setData({
            msg: thosres,
            markers: [{
              iconPath: "/img/point.png",
              id: 0,
              latitude: res.params.result[0].config.lat,
              longitude: res.params.result[0].config.lng,
              width: 30,
              height: 30
            }]
          })
          that.getFollow()
          that.getTui()
        }else{
          wx.request({
            url: 'https://apis.map.qq.com/ws/coord/v1/translate?type=3&key=RY6BZ-PXOCF-V5CJS-NPRMB-KMV7K-HMBBV&locations=' + res.params.result[0].config.lat + ',' + res.params.result[0].config.lng,
            success(res) {
              thosres.config.lat = res.data.locations[0].lat
              thosres.config.lng = res.data.locations[0].lng
              that.setData({
                msg: thosres,
                markers: [{
                  iconPath: "/img/point.png",
                  id: 0,
                  latitude: res.data.locations[0].lat,
                  longitude: res.data.locations[0].lng,
                  width: 30,
                  height: 30
                }]
              })
              that.getFollow()
              that.getTui()
            }
          })
        }
        
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:800
        })
        
      }
    })
  },
  getTui() {
    var that = this;
    var query = {
      fields: [],
      wheres: [
        { value: "miniId", opertionType: "equal", opertionValue: app.id},
        { value: "isDelete", opertionType: "equal", opertionValue: false },
        { value: "remark1", opertionType: "equal", opertionValue: '二手房' },
        { value: "sunwouId", opertionType: "ne", opertionValue: this.data.msg.sunwouId },
        { value: "config.city", opertionType: "equal", opertionValue: this.data.msg.config.city },
      ],
      sorts: [
        
      ],
      pages: {
        currentPage: 1,
        size: 8
      }
    }
    if (wx.getStorageSync("showData")[0].recommend[0].value == "最近发布"){
      query.sorts.push({ value: 'createTime', asc: false })
    }
    app.post('exh/find', {
      query: JSON.stringify(query)}, function (res) {
      if (res.code) {
        that.setData({
          list: res.params.result
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
  redTo(e){
    wx.redirectTo({
      url: '/pages/houseDetail/houseDetail?id='+e.currentTarget.dataset.id,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: this.data.msg.title,
      path:'/pages/houseDetail/houseDetail?id='+this.data.msg.sunwouId+'&iss=1'
    }
  }
})