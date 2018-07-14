const app = getApp()
var com = require('../../../utils/common.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:false,
    query: {
      fields: [],
      wheres: [
        { value: "sunwouId", opertionType: "equal", opertionValue: '' },
        { value: "isDelete", opertionType: "equal", opertionValue: false }
      ],
      sorts: [{ value: "sort", asc: false }],
      pages: {
        currentPage: 1,
        size: 10
      }
    },
  },
  tijiaodingdan(e){
    com.pay(e.currentTarget.dataset.id, "微信支付","redirectTo")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.data.query.wheres[0].opertionValue = options.id
    this.getOrder()
  },
  getOrder() {
    this.setData({ load: true })

    com.post('order/find', {
      query: JSON.stringify(this.data.query)
    }, function (res) {
      if (res.code) {
        for (var i in res.params.msg) {
          switch (res.params.msg[i].status) {
            case "待付款": res.params.msg[i].style = 0; break;
            case "待接手": res.params.msg[i].style = 1; break;
            case "制作中": res.params.msg[i].style = 2; break;
            case "待取货": res.params.msg[i].style = 3; break;
            case "交易完成": res.params.msg[i].style = 4; break;
            case "已取消": res.params.msg[i].style = 5; break;
          }
        }

        that.setData({
          load: false,
          list: res.params.msg
        })
      }

    })
  },

})