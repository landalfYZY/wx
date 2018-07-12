var app = getApp()
var com = require('../../utils/common.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data            : {
    nums          : 0,
    sum           : 0.00,
    flag1         : 0,
    flag2         : 0,
    tempGoods     : {},
    showTempGoods : false,
    load          : false,
    scroll        : false,
    tempCate      : '',
    showCart      : false,
    shopMsg       : null,
    category      : [],
    categoryFlag  : 0,
    cart          : [],
    iconList      : [{
        icon: '/images/quanjing.png',
        text: '店铺相册',
        path: ''
      },
      {
        icon: '/images/dh.png',
        text: '导航到店',
        path: ''
      },
      {
        icon: '/images/call.png',
        text: '联系电话',
        path: ''
      },
      {
        icon: '/images/pinlun.png',
        text: '客服',
        path: ''
      }
    ],
    query         : {
      fields: [],
      wheres: [{
          value: "shopId",
          opertionType: "equal",
          opertionValue: ''
        },
        {
          value: "isDelete",
          opertionType: "equal",
          opertionValue: false
        },
        {
          value: "able",
          opertionType: "equal",
          opertionValue: true
        },
      ],
      sorts: [{
        value: "sort",
        asc: true
      }],
      pages: {
        currentPage: 1,
        size: 1000
      }
    },
  },
  bindScroll(e){
    this.setData({
      scroll:true
    })
  },
  payIt(e) {
    wx.navigateTo({
      url: '/pages/pay/pay?'
            +'shop='+ JSON.stringify(this.data.shopMsg)
            +'&cart='+ JSON.stringify(this.data.cart)
            +'&sum=' + this.data.sum
    })
  },
  iconClick(e) {
    if (e.currentTarget.dataset.index == 1){
      com.dget(com.config.MAP_API + 'geoconv/v1/', {
        from: 5,
        to: 3,
        coords: this.data.shopMsg.lng + ',' + this.data.shopMsg.lat ,
        output: 'json',
        ak: com.config.KEY
      }, function (res) {
        wx.openLocation({
          latitude: res.data.result[0].y,
          longitude: res.data.result[0].x,
          scale: 28
        })
      })
    }
    if (e.currentTarget.dataset.index == 2) {
      wx.makePhoneCall({
        phoneNumber: this.data.shopMsg.phone,
      })
    }
  },

  // 选择左侧选项框
  selectNav: function(e) {
    var index = e.currentTarget.dataset.index;
    //原选中的改为不选中
    this.data.category[this.data.categoryFlag].active = false;

    this.data.category[index].active = true;
    this.setData({
      tempCate: 's'+that.data.category[index].sunwouId,
      category: that.data.category,
      categoryFlag: index
    })
  },
  //打开或关闭购物车
  openCart() {
    var that = this
    this.setData({
      showCart: !that.data.showCart
    })
  },
  //选择规格
  attrChecked(e){
    var index1 = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.indexr;
    this.data.tempGoods = this.initAttr(index1, this.data.tempGoods)
    this.data.tempGoods.attributeCategorys[index1].attributes[index2].active = true;
    this.setData({
      tempGoods: that.data.tempGoods
    })
  },
  //关闭规格界面
  closeAttr(){
    this.setData({
      showTempGoods: false
    })
  },
  //初始化规格
  initAttr(index,par){
    if(index){
      for (var i in par.attributeCategorys[index].attributes){
        par.attributeCategorys[index].attributes[i].active = false;
      }
    }else{
      for (var i in par.attributeCategorys) {
        for (var j in par.attributeCategorys[i].attributes) {
          par.attributeCategorys[i].attributes[j].active = false;
        }
      }
    }
    return par
  },
  chooseAttr(){
    var temp = [];
    var par = this.data.tempGoods;
    for (var i in par.attributeCategorys){
      temp.push(false)
      for (var j in par.attributeCategorys[i].attributes){
        if (par.attributeCategorys[i].attributes[j].active){
          temp[i] = true
        }
      }
    }
    var tempText = '';
    for(var i in temp){
      if(temp[i] == false){
        tempText += par.attributeCategorys[i].name +' '
      }
    }
    
    if(tempText != ''){
      tempText += '您还还没选';
      wx.showToast({
        title: tempText,
        icon:'none'
      })
    }else{
      this.closeAttr();
      this.toCart();
    }
  },
  //添加到购物车
  toCart(){
    var temp = -1;
    for(var i in this.data.cart){
      if(this.data.cart[i].sunwouId == this.data.tempGoods.sunwouId){
        if (JSON.stringify(this.data.cart[i].attributeCategorys) == 
            JSON.stringify(this.data.tempGoods.attributeCategorys)) {
          temp = i
        }
      }
    }
    this.data.category[this.data.flag1].children[this.data.flag2].num += 1 ;
    if(temp == -1){
      this.data.tempGoods.num    = 1;
      this.data.tempGoods.index1 = this.data.flag1;
      this.data.tempGoods.index2 = this.data.flag2;
      for (var i in this.data.cart) {
          var add = 0;
          for (var j in this.data.cart[i].attributeCategorys) {
            for (var k in this.data.cart[i].attributeCategorys[j].attributes) {
              if (this.data.cart[i].attributeCategorys[j].attributes[k].active) {
                add += parseFloat(this.data.cart[i].attributeCategorys[j].attributes[k].add)
              }
            }
          }
          cart[i].discount += add;
      }
      this.data.cart.push(JSON.parse(JSON.stringify(this.data.tempGoods)));
    }else{
      this.data.cart[temp].num += 1;
    }
    this.setData({
      category: that.data.category,
      cart: that.data.cart
    })
    this.cartFilter()
  },
  //添加到购物车2
  addToCart2(e){
    var index = e.currentTarget.dataset.index;
    var cart = this.data.cart;
    var category = this.data.category;

    cart[index].num += 1;
    if (cart[index].attributes.length > 0) {
      category[cart[index].index1].children[cart[index].index2].num += 1;
    }
    this.setData({
      cart: cart,
      category: category
    })
  },
  //添加到购物车点击事件
  addToCart: function(e) {
    var index1        = e.currentTarget.dataset.index  ;
    var index2        = e.currentTarget.dataset.indexr ;
    var tempGoods     = this.data.tempgoods;
    var showTempGoods = false;
    var cart          = this.data.cart;
    var category      = this.data.category;

    if(this.data.category[index1].children[index2].attributes.length > 0){
      tempGoods = JSON.parse(JSON.stringify(that.initAttr(null, that.data.category[index1].children[index2])));
      showTempGoods = true;
    }else{
      var temp = -1;
      for(var i in this.data.cart){
        if (this.data.cart[i].sunwouId == this.data.category[index1].children[index2].sunwouId){
          temp = i
        }
      }
      if(temp == -1){
        this.data.category[index1].children[index2].num = 1;
        cart.push(this.data.category[index1].children[index2])
      }else{
        cart[temp].num += 1;
      }
    }
    this.setData({
      flag1: index1,
      flag2: index2,
      tempGoods: tempGoods,
      showTempGoods: showTempGoods,
      cart:cart,
      category:category
    })
    this.cartFilter()
  },
  //移除购物车
  disAddCart(e){
    var index1   = e.currentTarget.dataset.index;
    var index2   = e.currentTarget.dataset.indexr;
    var cart     = this.data.cart;
    var category = this.data.category;
    if (category[index1].children[index2].attributes.length > 0){
      category[index1].children[index2].num -= 1;
      for(var i in cart){
        if (cart[i].sunwouId == category[index1].children[index2].sunwouId){
          if (JSON.stringify(cart[i].attributeCategorys) == JSON.stringify(category[index1].children[index2].attributeCategorys)){
            if(cart[i].num > 1){
              cart[i].num -= 1
            }else{
              cart.splice(i,1)
            }
          }
        }
      }
    }else{
      category[index1].children[index2].num -= 1;
    }

    this.setData({
      category : category,
      cart     : cart
    })
    this.cartFilter()
  },
  //移除购物车2
  disAddCart2(e){
    var index        = e.currentTarget.dataset.index;
    var cart         = this.data.cart;
    var category     = this.data.category;
    
    if (cart[index].attributes.length > 0) {
      category[cart[index].index1].children[cart[index].index2].num -= 1;
    }
    if (cart[index].num > 1) {
      cart[index].num -= 1;
    } else {
      cart[index].num = 0;
      cart.splice(index, 1)
    }
    this.setData({
      cart     : cart,
      category : category
    })
    this.cartFilter()
  },
  //购物车过滤
  cartFilter(){
    var cart = this.data.cart;
    var nums = 0;
    var sum  = 0;

    for( var i in cart ){
      nums  += parseInt(cart[i].num);
      if (cart[i].attributes.length == 0){
        sum += parseFloat(cart[i].discount) * parseFloat(cart[i].num)
      }else{
        var add = 0;
        for (var j in cart[i].attributeCategorys){
          for (var k in cart[i].attributeCategorys[j].attributes){
            if (cart[i].attributeCategorys[j].attributes[k].active){
              add += parseFloat(cart[i].attributeCategorys[j].attributes[k].add)
            }
          }
        }
        sum += (parseFloat(cart[i].discount) + add) * parseFloat(cart[i].num)
      }
    }

    this.setData({
      nums : nums,
      sum  : sum.toFixed(2)
    })
  },
  //清空购物车
  clearCart(){
    var category = this.data.category;

    for( var i in category ){
      for( var j in category[i].children ){
        category[i].children[j].num = 0;
      }
    }

    this.setData({
      category: category,
      cart:[]
    })
    this.cartFilter()
  },
  onLoad: function(options) {
    that = this;
    var shopId = options.id;
    this.setData({
      shopId: shopId,
      load:true
    })
    this.initData();
  },
  initData() {
    com.getWindowSize(this);
    this.getShopDetail()
  },
  //获取店铺信息
  getShopDetail() {
    com.post("shop/find", {
      query: JSON.stringify({
        fields: [],
        wheres: [{
          value: "sunwouId",
          opertionType: "equal",
          opertionValue: this.data.shopId
        }],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 1
        }
      })
    }, function(res) {
      if (res.code) {
        that.setData({
          shopMsg: res.params.msg[0]
        })
        that.getCategory()
      }
    })
  },
  //获取分类
  getCategory() {
    com.post("productcategory/find", {
      query: JSON.stringify({
        fields: [],
        wheres: [{
          value: "shopId",
          opertionType: "equal",
          opertionValue: this.data.shopId
        }],
        sorts: [{
          value: "sort",
          asc: true
        }],
        pages: {
          currentPage: 1,
          size: 1000
        }
      })
    }, function(res) {
      if (res.code) {
        for (var i in res.params.msg) {
          res.params.msg[i].active = false;
          res.params.msg[i].children = [];
        }
        res.params.msg[0].active = true
        that.setData({
          category: res.params.msg,
          categoryFlag: 0
        })
        that.getGoods()
      }
    })
  },
  //获取商品
  getGoods() {
    this.data.query.wheres[0].opertionValue = this.data.shopMsg.sunwouId;
    com.post("product/find", {
      query: JSON.stringify(this.data.query)
    }, function(res) {
      if (res.code) {
        for (var i in res.params.msg){
          res.params.msg[i].num = 0;
        }
        that.setData({
          goods: res.params.msg
        })
        that.compgc()
      }
    })
  },
  //商品分类组合
  compgc() {
    var cate  = this.data.category;
    var goods = this.data.goods;
    for(var i in cate){
      for(var j in goods){
        if (cate[i].sunwouId == goods[j].productCategoryId){
          cate[i].children.push(goods[j])
        }
      }
    }
    this.setData({
      category:cate,
      load:false
    })
  },

  onShareAppMessage: function() {
    return {
      title: this.data.shopMsg.shopName,
      path: '/pages/menu/menu?id=' + this.data.shopMsg.sunwouId
    }
  }
})