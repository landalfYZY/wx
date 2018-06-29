//index.js
//获取应用实例
const app = getApp()
var com = require('../../utils/common.js')
Page({
  data: {
     
  },
  navTo(e){
    com.wxNavgiteTo(e.currentTarget.dataset.navurl,["id"],e.currentTarget.dataset)
  },
  onLoad: function () {
    com.setTitleBarColor('#ffffff','#fd8b69')
  },

})
