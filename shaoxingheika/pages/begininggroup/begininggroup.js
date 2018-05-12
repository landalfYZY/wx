// pages/begininggroup/begininggroup.js
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isdisabled: false,
    canjoin: false,
    ip: '',
    groupInfo: {}
  },
  navtogroupInfo:function(e){
    wx.navigateTo({
      url: '/pages/groupinfo/groupinfo?id='+that.data.groupInfo.fk_gr_id,
    })
  },
  navtoshop:function(e){
    wx.redirectTo({
      url: '/pages/shop/shop?sunwouId=' + that.data.groupInfo.groupInfo.shopId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  checkuserInfo(_success) {
    let userInfo = wx.getStorageSync('WXuserInfo');
    if (userInfo == undefined || userInfo == null || userInfo == '') {
      wx.getUserInfo({
        success: function (res) {
          wx.setStorageSync('WXuserInfo', res.userInfo)
          that.updateUserInfo(res.userInfo)
          let checkgroup=wx.getStorageSync("group");
          if(checkgroup==undefined){
            let group={
              count:1,
              timestamp : new Date(new Date().setHours(0, 0, 0, 0)) / 1000
            };
            wx.setStorageSync("group", group)
            _success(res.userInfo);            
          }else{
            let timestamp = new Date() / 1000;
            if(timestamp-checkgroup.timestamp>=84000){
              let group = {
                count:1,
                timestamp : new Date(new Date().setHours(0, 0, 0, 0)) / 1000
              };
              wx.setStorageSync("group", group)
              _success(res.userInfo);         
            } else if (checkgroup.count<=5){
              checkgroup.count = checkgroup.count+1;
              wx.setStorageSync("group", checkgroup);
              _success(res.userInfo);   
            }else{
              app.showModel("提示","您今天拼团次数已经5次啦，明天再来吧！！！")
            }
          }
        },
        fail(res) {
          app.showModel("提示", "请先授权获取用户信息！！", function (res) {
            wx.openSetting({
              success: (res) => {
                that.setData({
                  isdisabled: false
                })
                wx.getUserInfo({
                  success: function (res) {
                    wx.setStorageSync('WXuserInfo', res.userInfo)
                    that.updateUserInfo(res.userInfo)
                    let checkgroup = wx.getStorageSync("group");
                    if (checkgroup == undefined) {
                      let group = {
                        count:1,
                        timestamp : new Date(new Date().setHours(0, 0, 0, 0)) / 1000
                      };
                      wx.setStorageSync("group", group)
                      _success(res.userInfo);
                    } else {
                      let timestamp = new Date() / 1000;
                      if (timestamp - checkgroup.timestamp >= 84000) {
                        let group = {
                          count:1,
                          timestamp : new Date(new Date().setHours(0, 0, 0, 0)) / 1000
                        };
                        wx.setStorageSync("group", group)
                        _success(res.userInfo);
                      } else if (checkgroup.count <= 5) {
                        checkgroup.count = checkgroup.count + 1;
                        wx.setStorageSync("group", checkgroup);
                        _success(res.userInfo);
                      } else {
                        app.showModel("提示", "您今天拼团次数已经5次啦，明天再来吧！！！")
                      }
                    }
                  }
                })
              },
              fail:(res)=>{
                that.setData({
                  isdisabled: false
                })
              }
            })
          },function(res){
            that.setData({
              isdisabled: false
            })
          })
        }
      })
      
    } else {
      let checkgroup = wx.getStorageSync("group");
      console.info(checkgroup)
      if (checkgroup == undefined || checkgroup == null || checkgroup == '') {
        let group = {
          count:1,
          timestamp : new Date(new Date().setHours(0, 0, 0, 0)) / 1000
        };
        wx.setStorageSync("group", group)
        _success(userInfo);
      } else {
        let timestamp = new Date() / 1000;
        console.info(timestamp)
        if (timestamp - checkgroup.timestamp >= 84000) {
          let group = {
            count:1,
            timestamp : new Date(new Date().setHours(0, 0, 0, 0)) / 1000
          };
          wx.setStorageSync("group", group)
          _success(userInfo);
        } else if (checkgroup.count <= 5) {
          checkgroup.count = checkgroup.count + 1;
          wx.setStorageSync("group", checkgroup);
          _success(userInfo);
        } else {
          app.showModel("提示", "您今天拼团次数已经5次啦，明天再来吧！！！")
        }
      }
    }
  },
  joingroup: function (e) {
    that.setData({
      isdisabled: true
    })
    let groupInfo = that.data.groupInfo;
    that.checkuserInfo(function(res){
      app.post("HuangCardPingTuan/groupuser/add.do", {
        fk_cg_id: groupInfo.cg_id,
        fk_gr_id: groupInfo.fk_gr_id,
        fk_us_id: app.globalData.SWuserInfo.sunwouId,
        successNum: groupInfo.groupInfo.gr_limitnum,
        groupName: groupInfo.groupInfo.gr_name,
        groupimg: groupInfo.groupInfo.gr_imglist[0],
        groupdeadline: groupInfo.groupInfo.gr_deadline,
        couponinfo: groupInfo.groupInfo.cpon_info,
        usericon: res.avatarUrl,
        usernickname: res.nickName,
        preptyid: e.detail.formId
      }, function (res) {
        console.info(res);
        if (res.code) {
          that.getgroupbuy(that.data.groupInfo.cg_id);
          that.getgroupjoinuser(that.data.groupInfo.cg_id);
        }
      })
    });
    
  },
  getgroupjoinuser(cg_id) {
    app.post("HuangCardPingTuan/groupuser/findEnjoyGroup.do", {
      fk_cg_id: cg_id
    }, function (res) {
      let SWuserInfo = app.globalData.SWuserInfo;
      let canjoin = true;
      if (res.code && res.params != undefined && res.params.list != undefined && res.params.list.length > 0) {
        let list = res.params.list;
        for (let i = 0; i < list.length; i++) {
          if (list[i].fk_us_id == SWuserInfo.sunwouId) {
            canjoin = false;
            break
          }
        }
      }
      that.setData({
        SWuserInfo: app.globalData.SWuserInfo,
        userlist: res.params.list,
        canjoin: canjoin,
      })
    })
  },
  getgroupbuy: function (id) {
    console.info(id)
    app.post("HuangCardPingTuan/creategroup/findGroupByUserId.do", {
      cg_id: id,
    }, function (res) {
      wx.hideLoading()
      if (res.code) {
        that.setData({
          SWuserInfo: app.globalData.SWuserInfo,
          groupInfo: res.params.list[0]
        })


      }
    })
  },
  diguifunction(id){
    if (app.globalData.SWuserInfo==null){
      setTimeout(function(){
        that.diguifunction(id);
      },500)
    }else{
      that.setData({
        SWuserInfo: app.globalData.SWuserInfo,
        ip: app.ip
      })
      that.getgroupbuy(id);
      that.getgroupjoinuser(id);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let id = options.id;
    wx.showLoading({
      title: '加载中',
    })
    that.diguifunction(id)
    // if (type != undefined) {
    //   setTimeout(function () {
    //     that.getgroupbuy(id);
    //     that.getgroupjoinuser(id);
    //     that.setData({
    //       SWuserInfo: app.globalData.SWuserInfo,
    //       ip: app.ip
    //     })
    //   }, 1000);
    // } else {
    //   that.getgroupbuy(id);
    //   that.getgroupjoinuser(id);
    //   that.setData({
    //     SWuserInfo: app.globalData.SWuserInfo,
    //     ip: app.ip
    //   })
    // }
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
    return {
      title: '快来参加优惠券团购吧！',
      path: '/pages/begininggroup/begininggroup?id=' + that.data.groupInfo.cg_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})