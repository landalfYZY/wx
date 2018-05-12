// pages/joinactivity/joinactivity.js
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activitylist:[],
    ip:''
  },
  //JavaScript从数组中删除指定值元素的方法
  removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
    return arr;
  },
  getIjoinActivity(){
    app.post("shop/shopuselogfindbyshopid", { userId: app.globalData.SWuserInfo.sunwouId},function(res){
      if(res.body!=undefined&&res.body.length>0){
        let activitylist = res.body;
        activitylist.forEach(function(item,index){
          if(item.shop!=undefined&&item.shop!=null){
            item.shop.image = item.shop.image.split(',');
            item.shop.image=that.removeByValue(item.shop.image,"");
            if (app.isJSON(item.shop.parentId)){
              item.shop.parentId = JSON.parse(item.shop.parentId);          
            }
          }
        })
        that.setData({
          activitylist: res.body
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getIjoinActivity();
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})