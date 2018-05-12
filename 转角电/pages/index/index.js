//index.js
//获取应用实例
const app = getApp()
let that;
let mapCtx;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    latitude: null,
    longitude: null,
    windowHeight: null,
    windowWidth: null,
    deviceId: '',
    isFoundDevice: false,
    success:false,
    markers: [{
      iconPath: "/images/abc.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 30,
      height: 30,
      callout: {
        content: '123',
        color: '#fff',
        borderRadius: 5,
        bgColor: '#000',
        display: 'BYCLICK',
      },
    }],
  },
   ab2hext:function(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
  return hexArr.join('');
  },
  regionchange(e) {
    console.log(e.type);
    if (e.type == 'end') {
      that.getCenterLocation();
    }
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad: function () {
    that = this;
    let controls = [
      {
        id: 1,
        iconPath: '/images/123.png',
        position: {
          left: that.data.windowWidth / 7 / 2,
          top: that.data.windowHeight - that.data.windowWidth / 7 - 15,
          width: that.data.windowWidth / 7,
          height: that.data.windowWidth / 7
        },
        clickable: true
      },
    ]
    that.goToLocation();
    wx.onBLECharacteristicValueChange(function (res) {
      that.data.success=true;
      console.info("=========++++++++++++++++++++===========");
      console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
      console.info(res);
      console.log(that.ab2hext(res.value))
    })

  },
  onReady: function () {
    mapCtx = wx.createMapContext('map');
  },
  //将地图中心点移动到当前设备定位位置
  moveToLocation: function () {
    mapCtx.moveToLocation()
  },
  //移动地图触发事件：得到地图中心位置
  getCenterLocation: function () {
    mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
        that.getNearBy(res.longitude, res.latitude);
      }
    })
  },
  //将地图定位到当前设备定位
  goToLocation: function (e) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.info(res);
        that.setData({
          latitude: 29.87897,
          longitude: 121.572578
        })
        that.getNearBy(res.longitude, res.latitude);
      }
    })
  },
  //得到附近的电源信息
  getNearBy: function (longitude, latitude) {
    app.post("electric/devices/nearby", {
      longitude: longitude,
      latitude: latitude
    }, function (res) {
      res.body.forEach((item) => {
        item.iconPath = '/images/e.png',
          item.width = 35,
          item.height = 35
      })
      console.info(res);
      that.setData({
        markers: res.body
      })
    })
  },
  //找到匹配的蓝牙设备
  foundBLEDevice: function (scanInfo) {
    wx.onBluetoothDeviceFound(function (devices) {
      console.log('new device list has founded')
      console.log(devices);
      let device = devices.devices[0];
      wx.showLoading({
        title: '连接设备中...',
      })
      that.setData({
        isFoundDevice: true
      })
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log(res)
        }
      });
      wx.createBLEConnection({
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
        deviceId: device.deviceId,
        success: function (res) {
          wx.showLoading({
            title: '获取服务...',
          })
          wx.getBLEDeviceServices({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
            deviceId: device.deviceId,
            success: function (res) {
              console.log('device services:', res.services)
              let service;
              res.services.forEach(function (item, index) {
                if (item.uuid.indexOf("FFE0") != -1) {
                  service = item;
                }
              })
              wx.getBLEDeviceCharacteristics({
                // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                deviceId: device.deviceId,
                // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                serviceId: service.uuid,
                success: function (res) {
                  console.log('device getBLEDeviceCharacteristics:', res.characteristics)
                  let characteristic;
                  res.characteristics.forEach(function (item, index) {
                    if (item.uuid.indexOf("FFE1") != -1) {
                      characteristic = item;
                    }
                  })
                  wx.notifyBLECharacteristicValueChange({
                    deviceId: device.deviceId,
                    serviceId: service.uuid,
                    characteristicId: characteristic.uuid,
                    state: true,
                    success: function (res) {
                      console.info("====================");
                      console.info(res);
                     
                    },
                  })
                  let buffer = new ArrayBuffer(1)
                  let dataView = new DataView(buffer)
                  dataView.setUint8(0, 0x40)
                  wx.showLoading({
                    title: '验证设备可用性...',
                  })
                  wx.writeBLECharacteristicValue({
                    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                    deviceId: device.deviceId,
                    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                    serviceId: service.uuid,
                    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
                    characteristicId: characteristic.uuid,
                    // 这里的value是ArrayBuffer类型
                    value: buffer,
                    success: function (res) {
                      console.log('writeBLECharacteristicValue success', res.errMsg)
                      app.showSuccessToast("验证成功", 1000);
                      wx.showActionSheet({
                        itemList: ['3小时1元', '6小时2元', '9小时3元'],
                        success: function (res) {
                          // wx.showLoading({
                          //   title: '发起支付',
                          // })
                          let tapIndex = res.tapIndex;
                          wx.showLoading({
                            title: "loading",
                          })
                          that.data.success = false;
                          let realbuffer = new ArrayBuffer(1)
                          let realdataView = new DataView(realbuffer)
                          realdataView.setUint8(0, 0x41 + tapIndex)
                          that.writeBle(device, service, characteristic, realbuffer);
                          // app.post("electric/devices/use/", {
                          //   devicesId: scanInfo,
                          //   userId: app.globalData.userInfo.userId,
                          //   type: res.tapIndex + 1,
                          //   clientName: 'wx'
                          // }, function (res) {
                          //   wx.hideLoading();
                          //   console.info(res);
                          //   wx.requestPayment({
                          //     'timeStamp': res.body.time,
                          //     'nonceStr': res.body.nonceStr,
                          //     'package': 'prepay_id=' + res.body.prepay_id,
                          //     'signType': 'MD5',
                          //     'paySign': res.body.paySign,
                          //     'success': function (res) {
                          //       wx.showLoading({
                          //         title: "loading",
                          //       })
                          //       that.data.success = false;
                          //       let realbuffer = new ArrayBuffer(1)
                          //       let realdataView = new DataView(realbuffer)
                          //       realdataView.setUint8(0, 0x41 + tapIndex)
                          //       that.writeBle(device, service, characteristic, realbuffer);
                          //     },
                          //     'fail': function (res) {
                          //       that.closeBLE(device);
                          //     }
                          //   })
                          // })

                        },
                        fail: function (res) {
                          app.showFailToast('未选择开启时间', 1200);
                          console.log(res.errMsg)
                          that.closeBLE(device);
                        }
                      })
                    },
                    fail: function (res) {
                      that.closeBLE(device);
                      app.showModel('提示', '该设备可能有点小问题，请换一个设备！！')
                    }
                  })
                },
                fail: function (res) {
                  that.closeBLE(device);
                  app.showModel('提示', '该设备可能有点小问题，请换一个设备！！')
                }
              })
            },
            fail: function (res) {
              that.closeBLE(device);
              app.showModel('提示', '该设备可能有点小问题，请换一个设备！！')
            }
          })
        },
        fail: function (res) {
          wx.closeBluetoothAdapter({
            success: function (res) {
              console.log(res)
            }
          })
          app.showModel('提示', '可能离设备远了点，靠近点再试试吧！！')
        }
      })
    })
  },
  writeBle: function (device, service, characteristic, realbuffer){
    wx.writeBLECharacteristicValue({
      deviceId: device.deviceId,
      serviceId: service.uuid,
      characteristicId: characteristic.uuid,
      value: realbuffer,
      success: function (res) {
        app.showSuccessToast('开启电源成功', 1200);
        console.info(res);
        if(that.data.success==false){
          that.writeBle(device, service, characteristic, realbuffer);
        }else{
          wx.hideLoading();
          that.closeBLE(device);
        }
      }
    })
  },
  //关闭蓝牙连接
  closeBLE: function (device) {
    wx.hideLoading();
    wx.closeBLEConnection({
      deviceId: device.deviceId,
      success: function (res) {
        console.log(res)
        wx.closeBluetoothAdapter({
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  //点击扫一扫按钮
  scanOfScan: function (e) {
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res)
        app.showModel('注意', "支付完成后必须点击【完成】按钮,电源才能启动！！", function (res) {
          wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              if (that.isJSON(res.result)) {
                let scanInfo = JSON.parse(res.result)
                console.info(scanInfo);
                if (scanInfo.sunwou) {
                  wx.startBluetoothDevicesDiscovery({
                    services: [scanInfo.sunwou],
                    success: function (res) {
                      wx.showLoading({
                        title: '搜索设备中...',
                      })
                      console.log(res);
                      setTimeout(function () {
                        if (!that.data.isFoundDevice) {
                          wx.hideLoading();
                          console.info("没有找到设备，靠近点试试！");

                          app.showModel('提示', '没有找到设备，靠近点试试！');
                          wx.closeBluetoothAdapter({
                            success: function (res) {
                              console.log(res)
                            }
                          })

                        }
                      }, 10000);
                    },
                    fail: function (res) {
                      app.showModel('提示', '二维码有误，请重试');
                    }
                  });
                  that.foundBLEDevice(scanInfo.sunwou);
                } else {
                  app.showModel('提示', '二维码有误，请重试');
                }

              } else {
                console.info("不是json数据")
                app.showModel('提示', '二维码有误，请重试');
              }

            },
            fail: function (res) {
              app.showFailToast('扫一扫错误', 1200);
            }
          })
        })

      },
      fail: function (res) {
        app.showModel('提示', '检测到您还未打开蓝牙功能，请前往手机设置里面打开')
      }
    })


  },
  //点击我的按钮
  myPage: function (res) {
    app.model("提示", "敬请期待！！");
  },
  //判断字符串是否json数据
  isJSON: function (str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (str.indexOf('{') > -1) {
          return true;
        } else {
          return false;
        }

      } catch (e) {
        console.log(e);
        return false;
      }
    }
    return false;
  }

})
