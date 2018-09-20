var app = getApp();
var that;

Page({

  data: {
    top: true,
    minDiscount: 0,
    shop: '',
    curIndex: '',
    navList: [],
    rightToView: null,
    discountflag: null,
    fullcut: [],
    cart: [],
    blankHeight: "none",
    castListStyle: 'none',
    cartIconStyle: 0,
    totalNum: 0,
    totalCanhefei: 0,
    totalPrice: 0,
    showdetail: false,
    iconList: [{
      icon: '/images/detailed.png',
      text: '隐藏顶部',
      share: 'kong'
    },
    {
      icon: '/images/navigation.png',
      text: '导航到店',
      share: 'kong'
    },
    {
      icon: '/images/call.png',
      text: '联系电话',
      share: 'kong'
    },
    {
      icon: '/images/share.png',
      text: '分享他人',
      share: 'share'
    }
    ],
  },

  onLoad: function (options) {
    app.getWindow(this);
    that = this;
    let id = '8d80c-20180822163533986';
    this.findShop(id);
    this.findGoods(id);
  },

  onShow: function () {

  },

  letTop: function () {
    that.setData({
      top: true,
    })
  },

  //查询店铺
  findShop: function (id) {
    app.post('/shop/findById', {
      sunwouId: id
    }, function (res) {
      if (res.data.code) {
        wx.setNavigationBarTitle({
          title: res.data.params.shop.shopName
        })
        if (res.data.params.shop.open == false && res.data.params.shop.OpenTime) {
          var print = '营业时间\t';
          for (var i = 0; i < res.data.params.shop.OpenTime.length; i++) {
            print += res.data.params.shop.OpenTime[i].start + "-" + res.data.params.shop.OpenTime[i].end + ",";
          };
          wx.showModal({
            title: '提示',
            content: print,
            showCancel: false,
            confirmColor: '#2c3e50',
            confirmText: '朕知道了',
            success: function (res) {
              if (res.confirm) { }
            }
          })
        } else if (res.data.params.shop.open == false && !res.data.params.shop.OpenTime) {
          wx.showModal({
            title: '提示',
            content: '商家停止接单了',
            showCancel: false,
            confirmColor: '#2c3e50',
            confirmText: '朕知道了',
            success: function (res) {
              if (res.confirm) { }
            }
          })
        } else if (!wx.getStorageSync("schoolId")) {
          app.getuser();
          wx.setStorageSync('schoolId', res.data.params.shop.schoolId)
          var query = {
            wheres: [{
              value: "_id",
              opertionType: "equal",
              opertionValue: res.data.params.shop.schoolId
            }],
            fields: ['schoolName', 'indexTopDay', 'indexTopTitle', 'phone']
          }
          app.post('school/find', {
            query: JSON.stringify(query)
          }, function (res) {
            if (res.data.code) {
              //成功
              var schools = res.data.params.schools[0];
              app.globalData.school = schools;
            }
          })
          app.post('/user/update', {
            sunwouId: app.globalData.user.sunwouId,
            schoolId: res.data.params.shop.schoolId,
          }, function (res) {
            if (res.data.code) {
              app.globalData.user = res.data.params.user;
            }
          })
        }
        var fulltext = ""
        for (var i = 0; i < res.data.params.fullcuts.length; i++) {
          fulltext += ' 满' + res.data.params.fullcuts[i].full + '减' + res.data.params.fullcuts[i].cut
        };
        if (!res.data.params.shop.minDiscount) {
          res.data.params.shop.minDiscount = 1
        } else {
          res.data.params.shop.minDiscount = (res.data.params.shop.minDiscount * 10).toFixed(1)
        }
        that.setData({
          shop: res.data.params.shop,
          minDiscount: res.data.params.shop.minDiscount,
          fullcut: res.data.params.fullcuts,
          fulltext: fulltext
        })
      }
    })
  },

  //请求所有商品和分类
  findGoods: function (id) {
    app.post('/product/findnotdelete', { shopId: id }, function (res) {
      if (res.data.code) {
        let product = res.data.params.list;
        for (var i = 0; i < product.length; i++) {
          for (var j = 0; j < product[i].attribute.length; j++) {
            product[i].attribute[j].num = 0;
            product[i].attribute[j].price = (product[i].attribute[j].price).toFixed(1);
            product[i].attribute[j].zkprice = (product[i].discount * product[i].attribute[j].price).toFixed(1);
            product[i].attribute[0].active = true
          }
          product[i].num = 0;
        }
        var query = {
          wheres: [{
            value: "shopId",
            opertionType: "equal",
            opertionValue: id
          }, {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }],
          pages: {
            currentPage: 1,
            size: 1000
          },
          sorts: [{
            "value": 'sort',
            asc: false
          }]
        };
        app.post('/category/find', {
          query: JSON.stringify(query)
        }, function (res) {
          if (res.data.code) {
            let categorys = res.data.params.categorys;
            if (that.data.minDiscount != 1) {
              let foods = [];
              for (var i = 0; i < product.length; i++) {
                if (product[i].discount < 1) {
                  foods = foods.concat(product[i]);
                }
              }
              that.data.navList.push({
                id: -1,
                name: '折扣',
                index: 0,
                foods: foods
              });
              for (var i = 0; i < categorys.length; i++) {
                let foods = [];
                for (var j = 0; j < product.length; j++) {
                  if (product[j].categoryId == categorys[i].sunwouId) {
                    foods = foods.concat(product[j]);
                  }
                }
                let item = {
                  id: i,
                  name: categorys[i].name,
                  index: i + 1,
                  categorysid: categorys[i].sunwouId,
                  foods: foods
                };
                that.data.navList.push(item);
                that.setData({
                  navList: that.data.navList,
                  curIndex: -1,
                })
              };
            } else {
              for (var i = 0; i < categorys.length; i++) {
                let foods = [];
                for (var j = 0; j < product.length; j++) {
                  if (product[j].categoryId == categorys[i].sunwouId) {
                    foods = foods.concat(product[j]);
                  }
                }
                let item = {
                  id: i,
                  name: categorys[i].name,
                  index: i + 1,
                  categorysid: categorys[i].sunwouId,
                  foods: foods
                };
                that.data.navList.push(item);
                that.setData({
                  navList: that.data.navList,
                  curIndex: 0,
                })
              };
            }
          }
        })
      }
    });
  },

  //商家四个icon
  iconClick: function (e) {
    if (e.currentTarget.dataset.index == 0) {
      that.setData({
        top: false,
      })
    } else if (e.currentTarget.dataset.index == 1) {
      wx.request({
        url: 'https://api.map.baidu.com/' + 'geoconv/v1/',
        method: 'get',
        dataType: 'json',
        data: {
          from: 5,
          to: 3,
          coords: that.data.shop.lng + ',' + that.data.shop.lat,
          output: 'json',
          ak: 'oRYkfitFSo3DxFdy8aI9y2PiQ6Km2DjC'
        },
        success: function (res) {
          wx.openLocation({
            latitude: res.data.result[0].y,
            longitude: res.data.result[0].x,
            scale: 28
          })
        }
      })
    } else if (e.currentTarget.dataset.index == 2) {
      wx.makePhoneCall({
        phoneNumber: that.data.shop.shopPhone,
      })
    }
  },

  //产品左侧分类菜单点击事件
  scrollLeftTap: function (e) {
    that.setData({
      curIndex: e.currentTarget.dataset.cateno,
      rightToView: 'r_' + e.currentTarget.dataset.cateno,
    })
  },

  //添加到购物车
  addCart: function (e) {
    let curIndex = that.data.minDiscount != 1 ? e.currentTarget.dataset.inde : e.currentTarget.dataset.inde - 1;
    let index = e.currentTarget.dataset.index;
    if (that.data.navList[curIndex].foods[index].attribute.length == 1) {
      that.addCart2(curIndex, index, 0);
    } else {
      that.open(e);
    }
  },
  addCart2: function (curIndex, index, attIndex) {
    let food = that.data.navList[curIndex].foods[index];
    that.data.navList[curIndex].foods[index].num++;
    that.data.navList[curIndex].foods[index].attribute[attIndex].num++;
    let obj = {
      curIndex: curIndex,
      index: index,
      sunwouId: food.sunwouId,
      id: food.sunwouId + attIndex,
      discount: food.discount,
      img: food.image,
      price: food.attribute[attIndex].price,
      zkprice: food.attribute[attIndex].zkprice,
      sum: (food.attribute[attIndex].zkprice * (food.attribute[attIndex].num)).toFixed(1),
      attr: food.attribute[attIndex].name,
      num: food.attribute[attIndex].num,
      name: food.name,
      boxPrice: that.data.shop.boxPrice,
      boxFlag: food.boxFlag,
      attIndex: attIndex,
      attrLength: food.attribute.length
    };
    let cart = that.data.cart;
    var flag = false;
    for (var i = 0; i < cart.length; i++) {
      var foodid = food.sunwouId + attIndex
      if (foodid == cart[i].id) {
        cart[i].num++;
        cart[i].sum = (cart[i].num * cart[i].zkprice).toFixed(1);
        flag = true;
      }
    }
    if (flag == false) {
      cart.push(obj);
    }
    that.setData({
      navList: that.data.navList,
      cart: cart,
    });
    that.calTotalPrice();
  },

  //点击加号出来左边的减号
  disaddCart: function (e) {
    let curIndex = that.data.minDiscount != 1 ? e.currentTarget.dataset.inde : e.currentTarget.dataset.inde - 1;
    let index = e.currentTarget.dataset.index;
    that.disaddCart2(curIndex, index, 0);
  },
  disaddCart2: function (curIndex, index, attIndex) {
    let food = that.data.navList[curIndex].foods[index];
    that.data.navList[curIndex].foods[index].num--;
    that.data.navList[curIndex].foods[index].attribute[attIndex].num--;
    let cart = that.data.cart;
    for (var i = 0; i < cart.length; i++) {
      var foodid = food.sunwouId + attIndex
      if (foodid == cart[i].id) {
        cart[i].num--
        cart[i].sum = (cart[i].num * cart[i].zkprice).toFixed(1)
        if (cart[i].num <= 0) {
          cart.splice(i, 1);
        }
        break;
      }
    }
    if (cart.length == 0) {
      that.data.showCartGoods = false;
      that.setData({
        castListStyle: "none",
        cartIconStyle: 0,
        blankHeight: "none"
      });
    }
    that.setData({
      navList: that.data.navList,
      cart: cart,
    })
    that.calTotalPrice();
  },

  // 打开菜的二级详情
  open: function (e) {
    let curIndex = that.data.minDiscount != 1 ? e.currentTarget.dataset.inde : e.currentTarget.dataset.inde - 1;
    let index = e.currentTarget.dataset.index;
    let food = that.data.navList[curIndex].foods[index];
    that.data.opencurIndex = curIndex;
    that.data.openindex = index;
    that.setData({
      openfoods: food,
      discount2: (food.discount * 10).toFixed(1),
      showdetail: true,
      attrIndex: 0,
    })
  },

  // 二级详情里头选择属性
  attrClick: function (e) {
    for (var i = 0; i < that.data.openfoods.attribute.length; i++) {
      that.data.openfoods.attribute[i].active = false;
    }
    that.data.openfoods.attribute[e.currentTarget.dataset.index].active = true;
    that.setData({
      openfoods: that.data.openfoods,
      attrIndex: e.currentTarget.dataset.index
    })
  },

  // 二级详情加入购物车按钮
  addCarte: function () {
    that.addCart2(that.data.opencurIndex, that.data.openindex, that.data.attrIndex);
    that.close()
  },

  // 关闭菜的二级详情
  close: function () {
    for (var i = 0; i < that.data.openfoods.attribute.length; i++) {
      that.data.openfoods.attribute[i].active = false;
    }
    that.data.openfoods.attribute[0].active = true;
    that.setData({
      openfoods: that.data.openfoods,
      showdetail: false,
      attrIndex: null,
    })
  },

  //显示购物车商品
  showCartGoods: function () {
    if (that.data.cart.length > 0 && that.data.showdetail == false) {
      if (that.data.showCartGoods == true) {
        that.data.showCartGoods = false;
        that.setData({
          castListStyle: "none",
          cartIconStyle: 0,
          blankHeight: "none"
        });
      } else {
        that.data.showCartGoods = true;
        that.setData({
          castListStyle: "block",
          cartIconStyle: "95rpx",
          blankHeight: "block"
        });
      }
    }
  },

  //点击清除购物车
  clearCart: function () {
    that.data.showCartGoods = false;
    that.setData({
      cart: []
    });
    that.calTotalPrice();
    for (var i = 0; i < that.data.navList.length; i++) {
      for (var j = 0; j < that.data.navList[i].foods.length; j++) {
        that.data.navList[i].foods[j].num = 0;
        for (var f = 0; f < that.data.navList[i].foods[j].attribute.length; f++) {
          that.data.navList[i].foods[j].attribute[f].num = 0;
        }
      }
    }
    that.setData({
      navList: that.data.navList,
      castListStyle: "none",
      cartIconStyle: 0,
      blankHeight: 'none',
    });
  },

  //在购物车里头增加物品
  addGoods: function (e) {
    let curIndex = e.currentTarget.dataset.inde;
    let index = e.currentTarget.dataset.index;
    let attIndex = e.currentTarget.dataset.attindex;
    that.addCart2(curIndex, index, attIndex);
  },

  //在购物车里头减去物品
  disaddGoods: function (e) {
    let curIndex = e.currentTarget.dataset.inde;
    let index = e.currentTarget.dataset.index;
    let attIndex = e.currentTarget.dataset.attindex;
    that.disaddCart2(curIndex, index, attIndex);
  },

  //计算数量和价格
  calTotalPrice: function () {
    var cart = that.data.cart;
    var totalNum = 0;
    var totalPrice = 0;
    var totalCanhefei = 0;
    var originalPrice = 0;
    var fullcut = true;
    for (var i = 0; i < cart.length; i++) {
      originalPrice += cart[i].price * cart[i].num;
      totalPrice += cart[i].zkprice * cart[i].num;
      totalNum += cart[i].num;
      if (cart[i].discount != 1) {
        fullcut = false;
        that.setData({
          discountflag: true
        })
      } else if ((cart[i].discount != 1).length == 0 && cart[i].discount == 1) {
        that.setData({
          discountflag: null
        })
      }
      if (cart[i].boxFlag == true) {
        totalCanhefei += cart[i].boxPrice * cart[i].num;
      }
    }
    if (fullcut == true) {
      totalPrice = that.fullcut(totalPrice);
    }
    that.setData({
      totalPrice: totalPrice.toFixed(1),
      totalNum: totalNum,
      totalCanhefei: totalCanhefei,
      discountPrice: (originalPrice - totalPrice).toFixed(1)
    })
  },

  //处理满减
  fullcut: function (totalPrice) {
    that.setData({
      discountflag: null
    })
    let fc;
    let fullcut = that.data.fullcut;
    for (let i = 0; i < fullcut.length; i++) {
      if (totalPrice >= fullcut[i].full) {
        fc = fullcut[i];
        that.setData({
          discountflag: false
        })
      }
    }
    if (fc) {
      return (totalPrice - fc.cut)
    } else {
      return totalPrice;
    }
  },

  //点击结算
  settlement: function () {
    if (that.data.totalPrice >= that.data.shop.startPrice) {
      if (that.data.shop.open == true) {
        var payment = (parseFloat(that.data.totalPrice) + parseFloat(that.data.totalCanhefei) + parseFloat(that.data.shop.sendPrice)).toFixed(1)
        wx.navigateTo({
          url: '/pages/menu/calculate/calculate?shop=' + JSON.stringify(that.data.shop) + '&totalNum=' + that.data.totalNum + '&totalPrice=' + that.data.totalPrice + '&totalCanhefei=' + that.data.totalCanhefei + '&cart=' + JSON.stringify(that.data.cart) + '&discountflag=' + that.data.discountflag + '&discountPrice=' + that.data.discountPrice + '&payment=' + payment,
        })
      }
    }
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') { }
    return {
      title: "巨好次，快来" + that.data.shopName + "这家店选购下单吧",
      path: '/pages/menu/menu?shopid=' + that.data.shop.sunwouId,
    }
  },

  onHide: function () {

  },

  onReady: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },
})