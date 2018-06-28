var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
    data: {
      navList:[
        {
          id: "0",
          name: '热销',
          num: '4'
        },
        {
          id: "1",
          name: '奶咖',
          num: '2'
        },
        {
          id: "2",
          name: '冬季暖咖',
          num: '5',
        },
        {
          id: "3",
          name: '卡布基诺',
          num: '3',
        },
      ],
      curNav: 0,
      foods:[
        {
          image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529494316937&di=d15e5c9173edb8162244d4dbcb7d33e5&imgtype=0&src=http%3A%2F%2Fwww.twgreatdaily.com%2Fimgs%2Fimage%2F134%2F13444323.jpg",
          name: '卡布基诺',
          text: '精选马拉西亚咖啡豆，山泉水高温熬制出炉，香味四溢',
          price: 10,
          zkprice: 5,
          num: 0
        },
        {
          image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529494316937&di=d15e5c9173edb8162244d4dbcb7d33e5&imgtype=0&src=http%3A%2F%2Fwww.twgreatdaily.com%2Fimgs%2Fimage%2F134%2F13444323.jpg",
          name: '卡布基诺',
          text: '精选马拉西亚咖啡豆，山泉水高温熬制出炉，香味四溢',
          price: 10,
          zkprice: 5,
          num: 0
        },
        {
          image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529494316937&di=d15e5c9173edb8162244d4dbcb7d33e5&imgtype=0&src=http%3A%2F%2Fwww.twgreatdaily.com%2Fimgs%2Fimage%2F134%2F13444323.jpg",
          name: '卡布基诺',
          text: '精选马拉西亚咖啡豆，山泉水高温熬制出炉，香味四溢',
          price: 10,
          zkprice: 5,
          num: 0
        },
        {
          image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529494316937&di=d15e5c9173edb8162244d4dbcb7d33e5&imgtype=0&src=http%3A%2F%2Fwww.twgreatdaily.com%2Fimgs%2Fimage%2F134%2F13444323.jpg",
          name: '卡布基诺',
          text: '精选马拉西亚咖啡豆，山泉水高温熬制出炉，香味四溢',
          price: 10,
          zkprice: 5,
          num: 0
        }
      ]
    },

    // 选择左侧选项框
    selectNav: function (e) {
      var id = e.target.dataset.id;
      this.setData({
        curNav: id,
      })
    },

    //添加到购物车
    addCart: function (e) {

    },
    // 点击加号出来左边的减号
    disaddCart: function (e) {
      
    

    },
  onLoad: function (options) {
    app.getWindow(this);
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})