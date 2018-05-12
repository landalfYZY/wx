// pages/shop/shop.js
const app=getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop:{},
    ip:'',
    sunwouId:'',
    discountlist:[],
    SWuserInfo:null,
    grouplist:[],
    shoplist:[]
  },
  navtoshop(e) {
    let sunwouId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/shop/shop?sunwouId=' + sunwouId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getmap:function(){
    let location = that.data.shop.location;
    wx.request({
      url: "https://apis.map.qq.com/ws/coord/v1/translate?locations=" + location[1] + "," + location[0] +"&type=3&key=6MABZ-RIICX-I624N-T6ALX-FC6WF-6XBS5",
      success:function(res){
        console.info(res);
        wx.openLocation({
          latitude: res.data.locations[0].lat,
          longitude: res.data.locations[0].lng,
          scale: 28
        })
      }
    })
  },
  navtogrooupbuy: function (e) {
    let gr_id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/groupinfo/groupinfo?id=' + gr_id,
    })
  },
  getgrouplist(shopId){
    app.post("HuangCardPingTuan/groupinfo/findYouWant.do", {
      shopId: shopId,
      page: 1,
      size: 100,
      isable: true,
      gr_online: "true"
    }, function (res) {
      if (res.code && res.params != undefined && res.params.list != undefined && res.params.list.length > 0) {
        let list =  res.params.list;
        that.setData({
          grouplist: list,
        })
      }

    })
  },
  addshopcar: function (userId, commodityId, outoftime, starttime, shopId, discountinfo, shopname){
    app.post("shop/ordercommodityadd", {
      userId: userId,
      commodityId: commodityId,
      number: 1,
      attributeIndex: 0
    }, function (res) {
      let orderCommodityId = res.result;
      that.addorder(userId, orderCommodityId, outoftime, starttime, shopId, discountinfo, shopname)
    })
  },
  addorder: function (userId, orderCommodityId, outoftime, starttime, shopId, discountinfo, shopname){
    app.post("shop/orderadd", {
      appid: app.sunwouId,
      userId: userId,
      orderCommodityId: orderCommodityId,
      numbers: "1",
      concatPeople: outoftime,
      concatPhone: "15999999999",
      addressArea: starttime,
      addressProvince: discountinfo,
      addressCity: shopname,
      addressDetail: shopId,
      clientName: "wx",
    }, function (res) {
      let orderId=res.body;
      that.payfor(orderId);
    })
  },
  payfor:function(orderId){
    app.post("shop/orderpayrequest",{orderId:orderId},function(res){
      that.wxpay(res.body);
    })
  },
  //微信支付
  wxpay: function (data) {
    console.info(data)
    wx.requestPayment({
      'timeStamp': data.time,
      'nonceStr': data.nonceStr,
      'package': 'prepay_id=' + data.prepay_id,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        console.info(res);
        wx.navigateTo({
          url: '/pages/mydiscount/mydiscount',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      'fail': function (res) {
        console.info(res);

      },

    })
  },
  buydiscount:function(e){
    let SWuserInfo = that.data.SWuserInfo
    if (SWuserInfo.payLog != undefined && SWuserInfo.payLog != null && SWuserInfo.payLog.length>0){
      let outoftime = e.currentTarget.dataset.outtime;
      let userId = app.globalData.SWuserInfo.sunwouId;
      let commodityId = e.currentTarget.dataset.id;
      let shopId = e.currentTarget.dataset.shopid;
      let starttime = e.currentTarget.dataset.starttime;
      let discountinfo = e.currentTarget.dataset.discountinfo;
      let shopname = that.data.shop.shopName;
      if (shopId == "" || shopId == undefined || shopId == null) {
        app.showFailToast("商户ID有误！！", 2000);
      } else if (outoftime == "" || outoftime == undefined || outoftime == null) {
        app.showFailToast("优惠券结束时间有误！！", 2000);
      } else if (userId == "" || userId == undefined || userId == null) {
        app.showFailToast("用户ID有误！！", 2000);
      } else if (commodityId == "" || commodityId == undefined || commodityId == null) {
        app.showFailToast("优惠券ID有误！！", 2000);
      } else if (starttime == "" || starttime == undefined || starttime == null) {
        app.showFailToast("优惠券开始时间有误！！", 2000);
      } else if (discountinfo == "" || discountinfo == undefined || discountinfo == null) {
        app.showFailToast("优惠信息有误！！", 2000);
      } else if (shopname == "" || shopname == undefined || shopname == null) {
        app.showFailToast("商户名称有误！！", 2000);
      } else {
        that.addshopcar(userId, commodityId, outoftime, starttime, shopId, discountinfo, shopname);
      }
    }else{
      app.showModel("提示","请先成为黑卡会员才能购买黑卡！！！");
    }
    
  },
  previewimage:function(e){
    let index=e.currentTarget.dataset.index;
    let images =[];
    that.data.shop.image.forEach(function(item,index){
      item=that.data.ip+item;
      images.push(item);
    })
    wx.previewImage({
      current: images[index], // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
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
  callphone:function(e){
    app.showModel("提示", "是否拨打商家(" + that.data.shop.phone+")电话？",function(res){
      wx.makePhoneCall({
        phoneNumber: that.data.shop.phone //仅为示例，并非真实的电话号码
      })
    })
  },
  getshop(sunwouId){
    app.post("shop/shopfind",{
      appid:app.sunwouId,
      sunwouId:sunwouId,
      distanceFlag: true,
      position: [app.globalData.locationpoint.longitude, app.globalData.locationpoint.latitude],
       },function(res){
        let shop=res.body[0];
        shop.parentId = JSON.parse(shop.parentId);
        shop.image = that.removeByValue(shop.image.split(","),'');
        shop.detail = shop.detail.substring(6, shop.detail.length)
        if (shop.distance != undefined && shop.distance != null && shop.distance != '') {
          if (shop.distance > 1000) {
            shop.distance = (shop.distance / 1000).toFixed(2) + "km";
          } else {
            shop.distance = shop.distance + "m";
          }
        }
        that.setData({
          shop: shop
        })
    })
  },

  getshoplist: function () {
    if (app.globalData.locationpoint=={}){
      app.getlocation();
      setTimeout(function(){
        that.getshoplist();
      },2000)
    }else{
      let data = {
        page: 1,
        size: 4,
        appid: app.sunwouId,
        distanceFlag: true,
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
          that.setData({
            shoplist: shoplist
          })
        }
      });
    }
  },

  getdiscountlist:function(shopId){
    app.post("shop/findcommodity",{
      shopId:shopId,
      appid:app.sunwouId,
      page:1,
      size:1000
      },function(res){
        let discountlist=res.body;
        if (discountlist!=undefined&&discountlist.length>0){
          discountlist.forEach(function(item){
            item.usertime=item.richtext+"至"+item.image;
          })
        }
        that.setData({
          discountlist: discountlist
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    let sunwouId=options.sunwouId;
    let SWuserInfo = app.globalData.SWuserInfo;
    that.setData({
      SWuserInfo: SWuserInfo,
      ip:app.ip,
      sunwouId:sunwouId
    })
    that.getshop(sunwouId);
    that.getdiscountlist(sunwouId);
    that.getgrouplist(sunwouId);
    that.getshoplist();
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
    return {
      title: that.data.shop.shopName,
      path: '/pages/shop/shop?sunwouId=' + that.data.shop.sunwouId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})