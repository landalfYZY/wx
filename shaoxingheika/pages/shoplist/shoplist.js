// pages/shoplist/shoplist.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskhidden: true,
    page:1,
    haveMore:false,
    loading:false,
    ip:'',
    searchinput:'',
    selectdown:null,
    typesindex:0,
    orderbyindex:0,
    types: ["全部类型","休闲娱乐", "美食", "酒店"],
    region: ['', '', ''],
    customItem: '全部',
    orderby:['智能排序',"离我最近"],
    selectlist:[],
    list:[]
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    that.data.page = 1;
    that.getshoplist(that.data.page);
  },
  searchblur:function(e){
    console.info(e)
    that.setData({
      searchinput:e.detail.value
    })
  },
  searchbyshopname:function(e){
    that.getshoplist(1);
  },
  getcategory(e){
    app.post("shop/categoryfind",{
      appid:app.sunwouId
    },function(res){
      let types=['全部类型'];
      if (res.body != undefined && res.body != null&&res.body.length>0){
        res.body.forEach(function (item, index) {
          types.push(item.name)
        })
      }

      that.setData({
        types:types,
        categorylist:res.body,

      })
    })
  },
  navtoshop(e){
    let sunwouId=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?sunwouId='+sunwouId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  hiddenmask:function(e){
    that.setData({
      maskhidden:true
    })
  },
  changeindex:function(e){
    let index = e.currentTarget.dataset.index;
    if (that.data.selectlist.toString() == that.data.types.toString()){
      that.setData({
        typesindex: index,
        maskhidden: true
      })
    } else if (that.data.selectlist.toString() == that.data.orderby.toString()) {
      that.setData({
        orderbyindex: index,
        maskhidden: true
      })
    }
    that.data.page=1;
    that.getshoplist(that.data.page);
  },
  selectDown:function(e){
    let type=e.currentTarget.dataset.type;
    if (that.data.selectdown == type) {
      that.setData({
        maskhidden: !that.data.maskhidden,
      })
    } else {
      that.setData({
        maskhidden: false,
      })
    }
    if(type==0){
      that.setData({
        selectlist: that.data.types,
        selectdown:type
      })
    }else if(type==2){
      that.setData({
        selectlist: that.data.orderby,
        selectdown: type
      })
    }

    
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
  getshoplist:function(page){
    that.setData({
      loading: true
    })
    let typesindex = that.data.typesindex;
    let orderbyindex = that.data.orderbyindex;
    let data={
      page: page,
      size:app.pageSize,
      appid:app.sunwouId,
      distanceFlag:true,
      shopName: that.data.searchinput,
      categoryId: typesindex == 0 ? '' : that.data.categorylist[typesindex - 1].sunwouId,
      province: that.data.region[0] == '全部' ? '' : that.data.region[0],
      city: that.data.region[1] == '全部' ? '' : that.data.region[1],
      area: that.data.region[2] == '全部' ? '' : that.data.region[2],
      position: [app.globalData.locationpoint.longitude, app.globalData.locationpoint.latitude],
      isShow:true
    }
    app.post("shop/shopfind",data,function(res){
      let shoplist=res.body;
      if (shoplist != undefined && shoplist != null&&shoplist.length>0){
        shoplist.forEach(function (item, index) {
          item.parentId = JSON.parse(item.parentId);
          item.image = item.image.split(",");
          item.image = that.removeByValue(item.image, "");
          if (item.distance != undefined && item.distance != null && item.distance != '') {
            if (item.distance > 1000) {
              item.distance = (item.distance / 1000).toFixed(2) + "km";
            } else {
              item.distance = item.distance + "m";
            }
          }
        })
        let haveMore = shoplist.length < app.pageSize ? false : true;
        let list=page==1?shoplist:that.data.list.concat(shoplist);
        that.setData({
          loading: false,
          page: res.currentPage,
          haveMore: haveMore,
          list: list
        })
      } else if (shoplist==undefined&&page==1){
        that.setData({
          loading: false,
          page: 1,
          haveMore: false,
          list: []
        })
      }else{
        that.setData({
          loading: false,
          page: 1,
          haveMore: false,
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getshoplist(that.data.page);
    that.getcategory();
    that.setData({
      position: app.globalData.position,
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
    if(that.data.haveMore){
      that.getshoplist(that.data.page + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})