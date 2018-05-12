//index.js
//获取应用实例
const app = getApp()
let that;
Page({
  data: {
    page:1,
    ip:'',
    haveMore:false,
    imagetextlist:[],
    carousellist:[],
    swiperCurrent: 0,
    loading:false,
  },

  navshoporimagetext:function(e){
    console.info(e);
    let sunwouId=e.currentTarget.dataset.id;
    let type=e.currentTarget.dataset.type;
    if(type=='图文信息'){
      that.navtoimagetext(e)
    }else if (type=="商户"){
      wx.navigateTo({
        url: '/pages/shop/shop?sunwouId=' + sunwouId,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else if(type=="黑卡"){
      wx.switchTab({
        url: '/pages/blackcard/blackcard',
      })
    }else{
      app.showModel("提示","该轮播图没有关联相关商户或图文信息！！！");
    }
  },
  navtoimagetext:function(e){
    let sunwouId=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/imagetext/imagetext?sunwouId='+sunwouId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  getcarousellist:function(e){
    let data={
      appid: app.sunwouId,
      type: 1
    }
    app.post("shop/findimageandtext",data,function(res){
      console.info(res);
      if (res.body != undefined && res.body !=null&&res.body.length>0){
        res.body.forEach(function (item, index) {
          item.path = JSON.parse(item.path)
        })
      }
      that.setData({
        carousellist:res.body
      })
    })
  },
  getimagetextlist:function(page){
    that.setData({
      loading:true
    })
    let data={
      isShow:true,
      page:page,
      size:app.pageSize,
      appid:app.sunwouId,
      type:2
    }
    app.post("shop/findimageandtext",data,function(res){
      let imagetextlist=res.body;
      if (imagetextlist != undefined && imagetextlist != null && imagetextlist!=''&&imagetextlist.length>0){
        let haveMore = imagetextlist.length>=5?true:false;
        if (page <= 1) {
          that.setData({
            imagetextlist: imagetextlist,
            page: res.currentPage,
            haveMore: haveMore,
            loading: false
          })
        } else {
          that.setData({
            haveMore: haveMore,
            page: res.currentPage,
            imagetextlist: that.imagetextlist.concat(imagetextlist),
            loading: false
          })
        }
      }else{
        that.setData({
          haveMore: false,
          loading: false
        })
      }
      
    })
  },
  onLoad: function () {
    that=this;
    that.getimagetextlist(that.data.page);
    that.setData({
      ip:app.ip,
    });
    that.getcarousellist();
  },
  onReachBottom:function(){
    if(that.data.haveMore){
      that.getimagetextlist(that.data.page + 1);
    }
  }

})
