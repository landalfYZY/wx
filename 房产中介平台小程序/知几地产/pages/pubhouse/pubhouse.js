var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    erflag: false,
    images: [],
    chaoxiang: ['南北', '朝北', '朝西', '朝东', '朝南'],
    cxflag: 0,
    floorTypes: ['板楼', '塔楼', '塔板结合'],
    ftflag: 0,
    room: ['一室', '二室', '三室', '四室', '四室以上'],
    roflag: 0,
    room2: ['一厅', '二厅', '三厅', '四厅'],
    roflag2: 0,
    room3: ['一卫', '二卫', '三卫', '四卫'],
    roflag3: 0,
    decorates: ["毛坯", "精装修", "简装修", "豪华装修"],
    deflag: 0,
    chewei: ['无', '有'],
    cwflag: 0,
    dianti: ['有', '无'],
    dtflag: 0,
    formData: {
      userId: app.uid,
      miniId: app.id,
      title: "",
      minPrice: "",
      note: "",
      remark1: "二手房",
      remark2: "下架",
      images: [],
      config: {
        wxuid: wx.getStorageSync("app").sunwouId,
        cover: '',
        floorType: '板楼',
        orientation: '南北',
        houseType: '',
        houseType2: '',
        houseType3: '',
        decorate: '毛坯',
        carnum: '无',
        elevator: '有',
        name: "",
        phone: "",
        province: "",
        city: "",
        areas: "",
        floorNum: "",
        address: "",
        lng: "",
        lat: "",
        tag: [],
        year: "",
        price: "",
        area: "",
        village: "",
        listingDate: '2018-04-04'
      }
    }
  },
  nameInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.config.name = e.detail.value
    this.setData({
      formData: formData
    })
  },
  phoneInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.config.phone = e.detail.value
    this.setData({
      formData: formData
    })
  },
  noteInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.note = e.detail.value
    this.setData({
      formData: formData
    })
  },
  villageInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.config.village = e.detail.value
    this.setData({
      formData: formData
    })
  },
  yearInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.config.year = e.detail.value
    this.setData({
      formData: formData
    })
  },
  floorNumInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.config.floorNum = e.detail.value
    this.setData({
      formData: formData
    })
  },
  priceInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.config.price = e.detail.value
    this.setData({
      formData: formData
    })
  },
  minPriceInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.minPrice = e.detail.value
    this.setData({
      formData: formData
    })
  },
  areaInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.config.area = e.detail.value
    this.setData({
      formData: formData
    })
  },
  titleInput(e) {
    var that = this;
    var formData = this.data.formData
    formData.title = e.detail.value
    this.setData({
      formData: formData
    })
  },
  bindDateChange: function (e) {
    var that = this;
    var formData = this.data.formData
    formData.config.listingDate = e.detail.value
    this.setData({
      formData: formData
    })
  },
  chooseAddress() {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var lo = res
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=RY6BZ-PXOCF-V5CJS-NPRMB-KMV7K-HMBBV&location=' + res.latitude + ',' + res.longitude,
          success(res) {
            var formData = that.data.formData
            formData.config.province = res.data.result.address_component.province
            formData.config.city = res.data.result.address_component.city
            formData.config.areas = res.data.result.address_component.district
            formData.config.address = res.data.result.address_component.street_number
            formData.config.lat = lo.latitude
            formData.config.lng = lo.longitude
            that.setData({
              formData: formData
            })
          }
        })
      },
    })
  },
  submitPublic() {
    var that = this
    if (this.data.formData.title == '') {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.config.area == '') {
      wx.showToast({
        title: '面积不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.minPrice == '') {
      wx.showToast({
        title: '售价不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.config.price == '') {
      wx.showToast({
        title: '单价不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.config.village == '') {
      wx.showToast({
        title: '小区不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.config.houseType == '') {
      wx.showToast({
        title: '户型不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.config.city == '') {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.config.name == '') {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none'
      })
    } else if (this.data.formData.config.city == '') {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none'
      })
    } else {
      var imgs = [];
      wx.showLoading({
        title: '发布中...',
        mask: true
      })
      if (this.data.erflag) {
        imgs = this.data.imagesOr
      }

      if (this.data.images.length == 0) {
        var data = JSON.stringify(that.data.formData)
        var dats = JSON.parse(data)
        dats.config = JSON.stringify(dats.config)
        var strr = 'exh/add'
        var ui = null
        if (that.data.erflag) {
          ui = {
            sunwouId: dats.sunwouId,
            title: dats.title,
            userId: dats.userId,
            minPrice: dats.minPrice,
            company: "",
            images: dats.images,
            configs: dats.config,
            note: dats.note,
            miniId: dats.miniId,
            position: "",
            remark1: "二手房",
            remark2: "上架"
          }
          strr = 'exh/update'
          dats = ui
        }

        app.post(strr, dats, function (res) {
          wx.hideLoading();

          if (res.code) {
            wx.showToast({
              title: '发布成功',
            })
            wx.redirectTo({
              url: '/pages/houseDetail/houseDetail?id=' + dats.sunwouId,
            })
          }
        })
      } else {
        var tem = 0
        for (var i = 0; i < this.data.images.length; i++) {

          if (i < 9) {
            wx.uploadFile({
              url: app.ip + 'filesystem/upfile',
              formData: {
                userId: app.uid
              },
              filePath: this.data.images[i],
              name: 'file',
              success(res) {
                tem += 1
                var res = JSON.parse(res.data)
                if (res.code) {
                  imgs.push({ url: res.msg })

                  if (tem == that.data.images.length) {

                    that.data.formData.images = JSON.stringify(imgs)
                    that.data.formData.config.cover = imgs[0].url;
                    var data = JSON.stringify(that.data.formData)
                    var dats = JSON.parse(data)
                    dats.config = JSON.stringify(dats.config)
                    var strr = 'exh/add'
                    var ui = null
                    if (that.data.erflag) {
                      ui = {
                        sunwouId: dats.sunwouId,
                        title: dats.title,
                        userId: dats.userId,
                        minPrice: dats.minPrice,
                        company: "",
                        images: dats.images,
                        configs: dats.config,
                        note: dats.note,
                        miniId: dats.miniId,
                        position: "",
                        remark1: "二手房",
                        remark2: "上架"
                      }
                      dats = ui
                      strr = 'exh/update'
                    }
                    if (that.data.jkl == false) {
                      app.post(strr, dats, function (res) {
                        wx.hideLoading();
                        that.setData({
                          jkl: true
                        })
                        if (res.code) {
                          wx.showToast({
                            title: '发布成功',
                          })
                          var sss = res.params.result
                          if (that.data.erflag) {
                            sss = dats.sunwouId
                          }
                          wx.redirectTo({
                            url: '/pages/houseDetail/houseDetail?id=' + sss,
                          })
                        }
                      })
                    }

                  }
                }
              }
            })


          }
        }
      }

    }
  },
  delUpim(e) {
    var that = this;
    this.data.imagesOr.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imagesOr: that.data.imagesOr
    })
  },
  delImage(e) {
    var that = this;
    this.data.images.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      images: that.data.images
    })
  },
  chooseCover() {
    var that = this;
    var formData = this.data.formData
    wx.chooseImage({
      count: 9,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        var li = that.data.images
        if (that.data.images.length > 0 & that.data.images.length < 9) {
          for (var i = 0; i < tempFilePaths.length; i++) {
            li.push(tempFilePaths[i])
          }
        } else {
          li = tempFilePaths
        }
        that.setData({
          images: li
        })
      },
    })
  },
  //朝向
  bindPickerChangeChaoxiang(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.orientation = that.data.chaoxiang[e.detail.value]
    this.setData({
      csflag: e.detail.value,
      formData: forDa
    })
  },
  //楼型
  bindPickerChangeFloorType(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.floorType = that.data.floorTypes[e.detail.value]
    this.setData({
      csflag: e.detail.value,
      formData: forDa
    })
  },
  //户型
  bindPickerChangeHouseType(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.houseType = that.data.room[e.detail.value]
    this.setData({
      roflag: e.detail.value,
      formData: forDa
    })
  },
  //户型2
  bindPickerChangeHouseType2(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.houseType2 = that.data.room2[e.detail.value]
    this.setData({
      roflag2: e.detail.value,
      formData: forDa
    })
  },
  //户型3
  bindPickerChangeHouseType3(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.houseType3 = that.data.room3[e.detail.value]
    this.setData({
      roflag3: e.detail.value,
      formData: forDa
    })
  },
  bindPickerChangeDecorates(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.decorate = that.data.decorates[e.detail.value]
    this.setData({
      deflag: e.detail.value,
      formData: forDa
    })
  },
  bindPickerChangeChewei(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.carnum = that.data.chewei[e.detail.value]
    this.setData({
      cwflag: e.detail.value,
      formData: forDa
    })
  },
  bindPickerChangeDianti(e) {
    var that = this
    var forDa = that.data.formData;
    forDa.config.elevator = that.data.dianti[e.detail.value]
    this.setData({
      dtflag: e.detail.value,
      formData: forDa
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      wx.setNavigationBarTitle({
        title: '编辑二手房',
      })
      this.getLi(options.id)
      this.setData({
        erflag: true
      })
    } else {
      var that = this;
      if (wx.getStorageSync("app")) {
        this.data.formData.config.name = wx.getStorageSync("app").nickName
        this.data.formData.config.phone = wx.getStorageSync("app").phone
        this.setData({
          formData: that.data.formData
        })
      }
    }
  },
  getLi(id) {
    var that = this;
    app.post('exh/find', {
      query: JSON.stringify({
        fields: [],
        wheres: [
          {
            value: "miniId",
            opertionType: "equal",
            opertionValue: app.id
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          },
          {
            value: "remark1",
            opertionType: "equal",
            opertionValue: '二手房'
          },
          {
            value: "sunwouId",
            opertionType: "equal",
            opertionValue: id
          },
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 10
        }
      })
    }, function (res) {
      if (res.code) {

        that.setData({
          formData: res.params.result[0],
          imagesOr: JSON.parse(res.params.result[0].images)
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 800
        })

      }
    })
  }



})