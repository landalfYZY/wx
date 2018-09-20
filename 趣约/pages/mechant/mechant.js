var com = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        logo:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533796528&di=0cc127e3df969a77f853550289607029&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.zyhychina.com%2Fweiweb%2Fxwzx_detail254yong%2Fshangbiaozhucezheng08.jpg',
        title: '纯K KTV', distence: 1.2, images: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533201636575&di=918805dff66f181b693a188bd36faf68&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D8abd0c8bb2014a9095334efdc00f5c7e%2F03087bf40ad162d96679d1251adfa9ec8a13cd70.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533201655549&di=9b5d6591edc0f47402dbd6e01d1c5adb&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fb999a9014c086e060d470e6509087bf40ad1cb34.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533201684376&di=5b3836ad519396b0581718ad9863178c&imgtype=0&src=http%3A%2F%2Fstatic-xiaoguotu.17house.com%2Fxgt%2Fs%2F00%2F14632420181260729.jpg'],
        labels: ['超市', '唱嗨', '啤酒', '骰子', '大冒险'], address:'科源路10号1幢 国瑶大厦对面'},
      {
        logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533199350994&di=11efcbd2f1c3b6f074856a0e870b6dfc&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20160831%2F68f4bff693c7487e9b84fe74f38db0eb_th.jpg',
        title: '星巴克 -- 武康店', distence: 3, images: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533200120202&di=203ec38b42732ff66e9d9a669009401e&imgtype=0&src=http%3A%2F%2F365jia.cn%2Fuploads%2Fnews%2Ffolder_1906374%2Fimages%2F661520537a90afe0c0ee00003406a745.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533794909&di=902e64f7f8adfc6eb258781f28586714&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fa044ad345982b2b7026c9ef93aadcbef76099b18.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533200216916&di=be75e580cda89e472a2077d0907a196c&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D0dfec521df0735fa85fd46f9f7296adf%2Fcefc1e178a82b901ec76a409788da9773912ef35.jpg'],
        labels: ['咖啡', '狼人杀', '办公', '纸牌游戏', 'wifi'], address: '科源路10号1幢 国瑶大厦对面'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    com.getWindowSize(this)
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