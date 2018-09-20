var util = require("utils/util.js");
App({
  onLaunch: function () {
    util.login(function(res){

    })
  },
  globalData: {
    userInfo: null
  }
})