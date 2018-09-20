const app = getApp()
var that ;
Page({
  data: {
    fixbar:[
      { label: '待接手', active: true }, { label: '制作中', active: false }, { label: '待取货', active: false }, { label: '交易完成', active: false }
    ]
  },
  changeFixbar(e){
    var index = e.currentTarget.dataset.index;
    for(var i in this.data.fixbar){
      this.data.fixbar[i].active = false;
    }
    this.data.fixbar[index].active = true;

    this.setData({ fixbar: that.data.fixbar})
  },
  onLoad: function () {
    that = this;
    if(wx.getStorageSync("user")){
      
    }
  },
  onShow(){
    if (!wx.getStorageSync("user")) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  }
})
