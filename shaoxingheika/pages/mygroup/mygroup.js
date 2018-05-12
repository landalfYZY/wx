// pages/mygroup/mygroup.js
const sliderWidth = 110;
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mygrouppage:1,
    joingrouppage:1,
    tabs: ["我参与的团购", "我组织的团购"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    myGroupHaveMore:false,
    myGroupList:[],
    joinGroupHaveMore:false,
    joinGroupList:[],
    ip:''
  },
  navtobegininggroup(e){
    let id=e.currentTarget.dataset.id;
    console.info(id)
    wx.navigateTo({
      url: '/pages/begininggroup/begininggroup?id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getSystemInfo:function(){
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  getmybegingroup:function(page){
    app.post("HuangCardPingTuan/creategroup/findGroupByUserId.do",{
      fk_us_id: app.globalData.SWuserInfo.sunwouId,
      page: page,
      size: app.pageSize
    },function(res){
      console.info(res)
      if(res.code){
        let myGroupHaveMore=res.params.list!=undefined&&res.params.list.length>=app.pageSize?true:false;
        let myGroupList=page>1?that.data.myGroupList.concat(res.params.list):res.params.list;
        that.setData({
          mygrouppage: page,
          myGroupHaveMore: myGroupHaveMore,
          myGroupList: myGroupList,
        })
      }else{
        app.showFailToast("数据错误",2000);
      }
      
    })
  },
  getmyjoingroup:function(page){
    app.post("HuangCardPingTuan/groupuser/findEnjoyGroup.do",{
      page:page,
      size: app.pageSize,
      fk_us_id: app.globalData.SWuserInfo.sunwouId
    },function(res){
      if (res.code) {
        let joinGroupHaveMore = res.params.list != undefined && res.params.list.length >= app.pageSize ? true : false;
        let joinGroupList = page > 1 ? that.data.joinGroupList.concat(res.params.list) : res.params.list;
        that.setData({
          joingrouppage:page,
          joinGroupHaveMore: joinGroupHaveMore,
          joinGroupList: joinGroupList,
        })
      } else {
        app.showFailToast("数据错误", 2000);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getSystemInfo();
    that.getmybegingroup(that.data.mygrouppage);
    that.getmyjoingroup(that.data.joingrouppage);
    that.setData({
      ip:app.ip
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
    if (that.data.activeIndex==0){
      if (that.data.joinGroupHaveMore){
        that.getmyjoingroup(that.data.joingrouppage+1);
      }
    }else{
      if (that.data.myGroupHaveMore) {
        that.getmybegingroup(that.data.mygrouppage + 1);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})