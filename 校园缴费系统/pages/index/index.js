
var app = getApp();

var that;

Page({

  config: {
    usingComponents: {
      'wxc-abnor': '@minui/wxc-abnor',
    }
  },
  data: {
    current: 'tab1',
    current_scroll: 'tab1',
    swiperCurrent: 0,
    slider: [
      {
        url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529408980539&di=bf013507d80f5043540bc6a93cfbd936&imgtype=0&src=http%3A%2F%2Fresources.51camel.com%2FResources%2FUEditor%2Fupload%2F2017-03-10%2F150ef6bc-78ca-42bc-88b2-f9e108a9b3f1.jpg'
      }
    ],
    autoplay: false,
    showdetail: false,
    guanlian: false,
    zhengjian: '',
    list:[],
    listorder:[],
    // current3: [],
    position: 'left',
    jiesuan: 0,
    zonji: 0,
    quan: false,
    listorders:[],
    totalorders: 1,
  },
  // handleFruitChange({ detail = {} }) {
  //   const index = this.data.current3.indexOf(detail.value);
  //   index === -1 ? this.data.current3.push(detail.value) : this.data.current3.splice(index, 1);
  //   this.setData({
  //     current3: this.data.current3
  //   });

  // },
  handleChange({ detail }) {
    if (detail.key == 'tab2'){
      var query = {
        wheres: [{ value: "wxuserId", opertionType: "equal", opertionValue: wx.getStorageSync("user").msg.sunwouId }, { value: 'status', opertionType: 'ne', opertionValue: '待缴费' },],
        pages: { currentPage: 1, size: 5 },
      }
      app.post('/order/find', { query: JSON.stringify(query) }, function (res) {
        if (res.data.code) {
          //成功
          that.setData({
            listorders: res.data.params.msg,
          })
        }
      })
    }
    this.setData({
      current: detail.key
    });
  },
  handleChangeScroll({ detail }) {
    this.setData({
      current_scroll: detail.key
    });
  },

  // 关联按钮
  guanlian: function () {
    this.setData({
      showdetail: true
    })
  },
  // 轮播图切换函数
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //联系人
  zhengjian: function (e) {
    that.data.zhengjian = e.detail.value
  },
  //登陆按钮
  queding: function () {
    app.post('/user/bind', { wxUserId: wx.getStorageSync("user").msg.sunwouId, no: that.data.zhengjian }, function (res) {
      if (res.data.code) {
        //成功
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          mask: true
        })
        that.huoqu(wx.getStorageSync("user").msg.sunwouId)
        that.setData({
          guanlian: true,
          showdetail: false
        })
        
      } 
      // else if (res.data.msg == "已经关联") {
      //   wx.showToast({
      //     title: '已经关联过了',
      //     image: '/images/tanHao.png',
      //     duration: 2000,
      //     mask: true
      //   })
      //   that.setData({
      //     guanlian: true,
      //     showdetail: false
      //   })
      // } 
      else {
        wx.showToast({
          title: res.data.msg,
          image: '/images/tanHao.png',
          duration: 2000,
          mask: true
        })
      }
    })
  },

  onLoad: function (options) {
    that = this;
    if (wx.getStorageSync("user")) {
      if (!wx.getStorageSync("user").msg.phone) {
        wx.navigateTo({
          url: '/pages/welecome/welecome',
        })
      }
    }
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
    this.setData({
      autoplay: true
    })
    if (wx.getStorageSync("user")) {
      that.huoqu(wx.getStorageSync("user").msg.sunwouId)
    } else {
      app.getuser(function (res) {
        that.huoqu(res.data.params.msg.sunwouId)
      })

    }
  },
  getPay: function (e) {
    var fee = e.currentTarget.dataset.index;
    var list = this.data.listorder;
    if (list[fee].act == true) {
      list[fee].act = false;
    } else {
      list[fee].act = true;
    }
    this.setData({ listorder: list })
    this.quanxuan(1)
  },
  quanxuan(bl) {
    var temp = 0;
    var qx = false;
    for (var i in this.data.listorder ){
      if(this.data.listorder[i].act){
        temp += 1
      }
    }
    if(bl == 1){
      if (temp == this.data.listorder.length) {
        qx = true
      } else if (temp < this.data.listorder.length) {
        qx = false
      }
    }else{
      if (this.data.quan) {
        qx = false
        for (var i = 0; i < this.data.listorder.length; i++) {
          this.data.listorder[i].act = false
        }

      } else if (!this.data.quan) {
        qx =true
        for (var i = 0; i < this.data.listorder.length; i++) {
          this.data.listorder[i].act = true
        }
      }
    }
    this.setData({
      quan: qx,
      listorder: this.data.listorder
    })
    this.sumTotal()
  },
  sumTotal(){
    var sum = 0;
    var jiesuan = 0
    for(var i in this.data.listorder){
      if(this.data.listorder[i].act){
        sum = parseFloat(sum) + parseFloat(this.data.listorder[i].amount)
        jiesuan = jiesuan + 1
      }
    }
    this.setData({
      zonji:sum.toFixed(2),
      jiesuan: jiesuan
    })
  },
  huoqu: function (id) {
    app.post('/user/findbind', { wxUserId: id }, function (res) {
      if (res.data.code) {
        that.setData({
          list: res.data.params.msg
        })
        app.post('/wxuser/findmypay', { wxUserid: id }, function (res) {
          if (res.data.code) {
            for (var i = 0; i < res.data.params.msg.length; i++) {
              res.data.params.msg[i].act = false
            }
            that.setData({
              listorder: res.data.params.msg
            })
          }
        })
      }
    })
  },
  quxiao: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否取消该缴费项',
      showCancel: true,
      confirmColor: '#2c3e50',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          app.post('/order/cancel', { orderId: e.currentTarget.dataset.id }, function (res) {
            if (res.data.code) {
              wx.showToast({
                title: '取消成功',
                duration: 2000,
                mask: true
              })
              app.post('/wxuser/findmypay', { wxUserid: wx.getStorageSync("user").msg.sunwouId }, function (res) {
                if (res.data.code) {
                  that.setData({
                    listorder: res.data.params.msg
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  xuangou: function () {
    var orderId = []
    for (var i in this.data.listorder) {
      if (this.data.listorder[i].act) {
        orderId.push(this.data.listorder[i].sunwouId);
      }
    }
    app.post("order/pay", {
      wxUserId: wx.getStorageSync("user").msg.sunwouId,
      orderId: orderId
    }, function (res) {
      let msg = res.data.params.msg;
      wx.requestPayment({
        timeStamp: msg.time,
        nonceStr: msg.nonceStr,
        package: 'prepay_id=' + msg.prepay_id,
        signType: 'MD5',
        paySign: msg.paySign,
        success: function (res) {
          app.post('/wxuser/findmypay', { wxUserid: wx.getStorageSync("user").msg.sunwouId }, function (res) {
            if (res.data.code) {
              that.setData({
                listorder: res.data.params.msg
              })
            }
          })
          this.setData({
            quan: false
          })
        },
        fail: function () {
          app.post('/wxuser/findmypay', { wxUserid: wx.getStorageSync("user").msg.sunwouId }, function (res) {
            if (res.data.code) {
              that.setData({
                listorder: res.data.params.msg
              })
            }
          })
          this.setData({
            quan: false
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      autoplay: false
    })
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