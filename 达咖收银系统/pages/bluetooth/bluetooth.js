var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    switchValue:false,
    list:[]
  },
  bluetoothSwitchChange(e){
    if(e.detail.value){
      this.openBluetooth()
    }else{
      wx.closeBluetoothAdapter({
        success: function (res) {
          that.setData({ loading: false })
        }
      })
    }
  },
  openBluetooth(){
    wx.openBluetoothAdapter({
      success: function (res) {
        wx.getBluetoothAdapterState({
          success: function (res) {
            that.setData({switchValue:true});
            that.searchDev();
          },fail(res){
            that.setData({ switchValue: false, loading: false })
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '请手动打开蓝牙设备',
          showCancel:false,
          success(res){
            that.setData({ switchValue: false, loading: false })
          }
        })
      }
    })
  },
  searchDev(){
    wx.startBluetoothDevicesDiscovery({
      // services: [],
      success: function (res) {
        // success
        console.log("-----startBluetoothDevicesDiscovery--success----------");
        console.log(res);
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })

    wx.getBluetoothDevices({
      success: function (res) {
  
        // that.setData({
        //   list: res.devices,
        //   loading: true
        // });
        console.log(that.data.list);
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    })
    wx.onBluetoothDeviceFound(function (devices) {
      console.log('onBluetoothDeviceFound')
      console.log(devices)
      for(var i in devices.devices){
        that.data.list.push(devices.devices[i])
      }
      that.setData({list:that.data.list})
    })
    wx.getConnectedBluetoothDevices({
      success: function (res) {
        console.log('getConnectedBluetoothDevices')
        console.log(res)
      }
    })

  },
  connectedIt(e){
    var index = e.currentTarget.dataset.index;
    wx.showLoading({
      title: '正在建立连接',
      mask:true
    })
    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
      deviceId: that.data.list[index].deviceId,
      success: function (res) {
        console.log(res)
      },
      fail(res){
        console.log(res)
      },
      complete(){
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this;
    that.openBluetooth()
    
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