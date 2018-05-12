var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCart: false,
    showGd: false,
    shopName: '',
    shopId: '',
    origin_category: [],
    origin_goods: [],
    origin_category_flag: 0,
    findex: 0,
    lindex: 0,
    fi:0,
    lb:0,
    carts: [],
    sum:0,
    count:0
  },
  subSum(){
    if(this.data.count == 0){
      wx.showToast({
        title: '购物车是空滴',
        icon:'none'
      })
    }else{
      if (wx.getStorageSync("app")) {
        if (wx.getStorageSync("phone")) {
          wx.navigateTo({
            url: '/pages/order/order?shopId=' + this.data.shopId + '&shopName=' + this.data.shopName + '&carts=' + JSON.stringify(this.data.carts) + '&count=' + this.data.count + '&sum=' + this.data.sum + '&box=' + this.data.box,
          })
        } else {
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone',
          })
        }
      } else {
        app.login(function (res) {
          if (res.code) {
            wx.removeStorageSync('app')
            wx.setStorageSync('app', res.params.user);
            if (wx.getStorageSync("app").phone) {
              wx.navigateTo({
                url: '/pages/order/order?shopId=' + this.data.shopId + '&shopName=' + this.data.shopName + '&carts=' + JSON.stringify(this.data.carts) + '&count=' + this.data.count + '&sum=' + this.data.sum + '&box=' + this.data.box,
              })
            } else {
              wx.navigateTo({
                url: '/pages/bindPhone/bindPhone',
              })
            }
          } else {
            wx.showToast({
              title: res.msg,
            })
          }
        })
      }
      
    }
  },
  changeShop() {
    wx.redirectTo({
      url: '/pages/shoplist/shoplist',
    })
  },
  cancel() {
    this.setData({
      showGd: false
    })
  },
  count(){
    var sum = 0;
    var count = 0;
    var pakege = 0;
    var that = this;
    for (var i in this.data.carts){
      count += this.data.carts[i].count
      this.data.carts[i].realprice = parseFloat(this.data.carts[i].price).toFixed(2); 
      for (var j in this.data.carts[i].attr){
        for (var k in this.data.carts[i].attr[j].value){
          if (this.data.carts[i].attr[j].value[k].active){
            this.data.carts[i].realprice = parseFloat(this.data.carts[i].realprice) + parseFloat(this.data.carts[i].attr[j].value[k].price)
          }
        }
      }
      this.data.carts[i].realprice = parseFloat(this.data.carts[i].realprice).toFixed(2)
      sum += this.data.carts[i].realprice * this.data.carts[i].count
    }
    this.setData({
      carts:that.data.carts,
      sum:sum,
      count:count
    })
  },
  /**
   * 确定加入购物车
   */
  doOk() {
    var that = this;
    var te = -1;
    
    this.data.origin_goods[this.data.findex].children[this.data.lindex].count += 1
    for (var i in this.data.carts) {
      
      if (this.data.carts[i].sunwouId == this.data.origin_goods[this.data.findex].children[this.data.lindex].sunwouId) {
        var temp = [];
        for (var j in this.data.carts[i].attr) {
          var rt = -1;
          for (var k in this.data.carts[i].attr[j].value) {

            if (this.data.carts[i].attr[j].value[k].active != this.data.origin_goods[this.data.findex].children[this.data.lindex].attr[j].value[k].active) {
              rt = k
            }
          }
          if(rt == -1){
            temp.push(j)
          }
         
        }
        if (temp.length == this.data.carts[i].attr.length){
          te = i
        }
      }
    }
    if (te == -1) {
      var tt = JSON.parse(JSON.stringify(this.data.origin_goods[this.data.findex].children[this.data.lindex]))
      tt.count = 1
      tt.findex = this.data.findex;
      tt.lindex = this.data.lindex;
      this.data.carts.push(tt)
    } else {
      this.data.carts[te].count += 1;
    }


    this.setData({
      carts: that.data.carts,
      origin_goods: that.data.origin_goods,
      showGd: false
    })
    this.count()
  },
  /**
   * 选择规格
   */
  chtags(e) {
    var that = this;
    if (this.data.fi == e.currentTarget.dataset.fi) {
      this.data.origin_goods[this.data.findex].children[this.data.lindex].attr[this.data.fi].value[this.data.lb].active = false
    }
    this.data.origin_goods[this.data.findex].children[this.data.lindex].attr[e.currentTarget.dataset.fi].value[e.currentTarget.dataset.lb].active = !this.data.origin_goods[this.data.findex].children[this.data.lindex].attr[e.currentTarget.dataset.fi].value[e.currentTarget.dataset.lb].active;
    this.setData({
      origin_goods: that.data.origin_goods,
      fi: e.currentTarget.dataset.fi,
      lb: e.currentTarget.dataset.lb
    })
  },
  /**
   * 移除购物车
   */
  refuToCart(e){
    var that = this
    this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].count -= 1
    var temp = -1
    for (var i in this.data.carts){
      if (this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].sunwouId == this.data.carts[i].sunwouId){
        temp = i
      }
    }
    if(temp != -1){
      if (this.data.carts[temp].count == 1){
        this.data.carts.splice(temp,1)
      }else{
        this.data.carts[temp].count -= 1
      }
    }
    this.setData({
      carts: that.data.carts,
      origin_goods: that.data.origin_goods,
    })
    this.count()
  },
  /**
   * 购物车减少
   */
  cartRuf(e){
    var that = this
    this.data.origin_goods[this.data.carts[e.currentTarget.dataset.index].findex].children[this.data.carts[e.currentTarget.dataset.index].lindex].count -= 1;
    if (this.data.carts[e.currentTarget.dataset.index].count  == 1){
      this.data.carts.splice(e.currentTarget.dataset.index,1)
    }else{
      this.data.carts[e.currentTarget.dataset.index].count -= 1
    }
    this.setData({
      carts: that.data.carts,
      origin_goods: that.data.origin_goods,
    })
    this.count()
  },
  /**
   * 购物车增加
   */
  cartCount(e){
    var that = this
    this.data.carts[e.currentTarget.dataset.index].count += 1
    this.data.origin_goods[this.data.carts[e.currentTarget.dataset.index].findex].children[this.data.carts[e.currentTarget.dataset.index].lindex].count += 1;
    this.setData({
      carts: that.data.carts,
      origin_goods: that.data.origin_goods,
    })
    this.count()
  },
  /**
   * 添加到购物车
   */
  addToCart(e) {
    var that = this
    var sg = false
    if (this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].attr.length == 0){
      sg=false;
      this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].count += 1
      var te = -1
      for (var i in this.data.carts) {
        if (this.data.carts[i].sunwouId == this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].sunwouId) {
          this.data.carts[i].count += 1
          te = i
        }
      }
      if(te == -1){
        var tt = JSON.parse(JSON.stringify(this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex]))
        tt.count = 1
        tt.findex = e.currentTarget.dataset.findex;
        tt.lindex = e.currentTarget.dataset.lindex;
        this.data.carts.push(tt)
      }
      this.count()
    }else{
      sg = true
      for (var i in this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].attr) {
        for (var j in this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].attr[i].value) {
          this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].attr[i].value[j].active = false
        }
        this.data.origin_goods[e.currentTarget.dataset.findex].children[e.currentTarget.dataset.lindex].attr[i].value[0].active = true
      }
    }
    
    this.setData({
      carts:that.data.carts,
      origin_goods: that.data.origin_goods,
      showGd: sg,
      findex: e.currentTarget.dataset.findex,
      lindex: e.currentTarget.dataset.lindex
    })
  },
  /**
   * 更换菜单
   */
  changeMeun(e) {
    this.setData({
      origin_category_flag: e.currentTarget.dataset.index
    })
  },
  /**
   * 获取分类
   */
  getCate() {
    var that = this;
    app.post('productcategory/find', {
      query: JSON.stringify({
        fields: ["name"],
        wheres: [
          {
            value: "shopid",
            opertionType: "equal",
            opertionValue: this.data.shopId
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }
        ],
        sorts: [{ value: 'sort', asc: true }, { value: 'createTime', asc: false }],
        pages: {
          currentPage: 1,
          size: 200
        }
      })
    }, function (res) {
      if (res.code) {
        for (var i in res.params.list) {
          res.params.list[i].active = false
        }
        res.params.list[0].active = true
        that.setData({
          origin_category_flag: 0,
          origin_category: res.params.list
        })
        that.getGoods()
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
  },
  /**
   * 获取商品
   */
  getGoods() {
    var that = this;
    app.post('product/find', {
      query: JSON.stringify({
        fields: [],
        wheres: [
          {
            value: "shopid",
            opertionType: "equal",
            opertionValue: this.data.shopId
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }
        ],
        sorts: [{ value: 'createTime', asc: false }],
        pages: {
          currentPage: 1,
          size: 200
        }
      })
    }, function (res) {
      if (res.code) {
        var li = [];
        for (var i in that.data.origin_category) {
          li.push({ name: that.data.origin_category[i].name, id: that.data.origin_category[i].sunwouId, children: [] })
        }
        for (var i in li) {
          for (var j in res.params.list) {
            res.params.list[j].cover = res.params.list[j].image.replace('-', '-thumbnail')
            res.params.list[j].attr = JSON.parse(res.params.list[j].attribute);
            res.params.list[j].count = 0
            if (li[i].id == res.params.list[j].categoryid) {
              li[i].children.push(res.params.list[j])
            }
          }
        }
        that.setData({
          origin_goods_flag: 0,
          origin_goods: li
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
  },
  /**
   * 打开或关闭购物车
   */
  isCart() {
    var that = this;
    that.setData({
      showCart: !that.data.showCart
    })
    if (that.data.showCart) {
      this.getHeight()
    }
  },
  /**
   * 获取购物车高度
   */
  getHeight() {
    var that = this;
    wx.createSelectorQuery().select('#cart').boundingClientRect(function (rect) {
      that.setData({
        cartHeight: rect.height,
      })
    }).exec()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var sys = res
        that.setData({
          shopName: options.shopName,
          width: sys.windowWidth,
          height: sys.windowHeight,
          shopId: options.id,
          box:options.box
        })
      },
    });
    this.getCate()
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