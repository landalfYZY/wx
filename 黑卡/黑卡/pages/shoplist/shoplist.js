// pages/shoplist/shoplist.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskhidden: true,
    page: 1,
    haveMore: false,
    loading: false,
    ip: '',
    searchinput: '',
    selectdown: null,
    typesindex: 0,
    areaindex: 0,
    orderbyindex: 0,
    types: ["全部类型", "休闲娱乐", "美食", "酒店"],
    area: ["全城", "印象城","雄风永利广场","万达广场","朗臻新天地","不夜城","第一百货","暨阳路", '大唐', '店口镇', '西施故里', '望云路', '客运中心', '大润发',  '郭家', '三角广场', '江东路', '三都镇',  '东白湖', '五泄马剑', '枫桥镇',  '长弄镇', '诸暨技师学院', '环城北路', '农林大学诸暨学院', '诸暨高铁站', '斗岩风景区', '白云山庄'],
    // area: ["全城","城市广场","金地银泰","世茂广场","万达广场","蓝天广场","越秀外国语学校镜湖校区","越秀外国语学校稽山校区","文理南山校区","文理河西河东校区","绍兴文理元培校区","工业镜湖校区","工业梅山校区","工业之江校区","绍兴技术职业校区","邮电","农商","其他校区"],
    orderby: ['离我最近', "智能排序"],
    selectlist: [],
    list: []
  },
  searchblur: function (e) {
    console.info(e)
    that.setData({
      searchinput: e.detail.value
    })
  },
  searchbyshopname: function (e) {
    that.getshoplist(1);
  },
  getcategory(e) {
    app.post("shop/categoryfind", {
      appid: app.sunwouId
    }, function (res) {
      let types = ['全部类型'];
      if (res.body != undefined && res.body != null && res.body.length > 0) {
        res.body.forEach(function (item, index) {
          types.push(item.name)
        })
      }

      that.setData({
        types: types,
        categorylist: res.body,

      })
    })
  },
  navtoshop(e) {
    let sunwouId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?sunwouId=' + sunwouId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  hiddenmask: function (e) {
    that.setData({
      maskhidden: true
    })
  },
  changeindex: function (e) {
    let index = e.currentTarget.dataset.index;
    if (that.data.selectlist.toString() == that.data.types.toString()) {
      that.setData({
        typesindex: index,
        maskhidden: true
      })
    } else if (that.data.selectlist.toString() == that.data.area.toString()) {
      that.setData({
        areaindex: index,
        maskhidden: true
      })
    } else if (that.data.selectlist.toString() == that.data.orderby.toString()) {
      that.setData({
        orderbyindex: index,
        maskhidden: true
      })
    }
    that.data.page = 1;
    that.getshoplist(that.data.page);
  },
  selectDown: function (e) {
    let type = e.currentTarget.dataset.type;
    if (that.data.selectdown == type) {
      that.setData({
        maskhidden: !that.data.maskhidden,
      })
    } else {
      that.setData({
        maskhidden: false,
      })
    }
    if (type == 0) {
      that.setData({
        selectlist: that.data.types,
        selectdown: type
      })
    } else if (type == 1) {
      that.setData({
        selectlist: that.data.area,
        selectdown: type
      })
    } else {
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
  getshoplist: function (page) {
    that.setData({
      loading: true
    })
    let typesindex = that.data.typesindex;
    let areaindex = that.data.areaindex;
    let orderbyindex = that.data.orderbyindex;
    let data = {
      page: page,
      size: app.pageSize,
      appid: app.sunwouId,
      distanceFlag: true,
      shopName: that.data.searchinput,
      categoryId: typesindex == 0 ? '' : that.data.categorylist[typesindex - 1].sunwouId,
      area: areaindex == 0 ? '' : that.data.area[areaindex],
      position: [app.globalData.locationpoint.longitude, app.globalData.locationpoint.latitude],
      isShow: true
    }
    app.post("shop/shopfind", data, function (res) {
      let shoplist = res.body;
      if (shoplist != undefined && shoplist != null && shoplist.length > 0) {
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
        let list = page == 1 ? shoplist : that.data.list.concat(shoplist);
        that.setData({
          loading: false,
          page: res.currentPage,
          haveMore: haveMore,
          list: list
        })
      } else if (shoplist == ''&&page!=1) {
        that.setData({
          loading: false,
          page: 1,
          haveMore: false,
        })
      } else {
        that.setData({
          list: [],
          loading: false,
          page: 1,
          haveMore: false,
        })
      }
    });
  },
  pregetshoplist() {
    if (app.globalData.locationpoint == null) {
      setTimeout(function (e) {
        that.pregetshoplist()
      }, 400)
    }else{
      that.getshoplist(that.data.page)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.pregetshoplist();
    that.getcategory();
    that.setData({
      ip: app.ip
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
    if (that.data.haveMore) {
      that.getshoplist(that.data.page + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})