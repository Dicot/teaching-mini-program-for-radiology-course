 const app=getApp()
const db = wx.cloud.database();
 var sec
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    jihe: "",
    jiheid:"",
    mingcheng: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dangqianimages:[],
    images: [],
    daishangchuanimages:{"photopath1":"","photopath2":""},
    fileList: [],
    canvasHeight: 0,
    canvasWidth: 0,
    sec:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      jihe: options.jihe,
      mingcheng: options.mingcheng
    })
    that.jugdeUserLogin();
    console.log(that.data.jihe, that.data.mingcheng)
    wx.cloud.init({
      env: 'tyttest-vqzij',
      traceUser: true
    });
    // 初始化数据库
    const db = wx.cloud.database();
    db.collection(that.data.jihe).where({
      mingcheng: that.data.mingcheng
    }).get().then(res => {
      if (res.data[0]) {
        that.data.jiheid = res.data[0]._id
        that.data.dangqianimages = res.data[0].photopath}
      if (!that.data.dangqianimages) { that.data.dangqianimages=[]}
      console.log(that.data.dangqianimages, that.data.jiheid)
    })
  },
  /**
   * 选择图片
   */
  chooseImage: function (event) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      //sourceType: ['camera'],
      //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var arr = that.data.fileList
        res.tempFilePaths.forEach(function (item) {
          arr.push(item)
        })
        that.setData({
          fileList: arr
        })
        console.log(that.data.fileList)
        //for (var j = 0; j < that.data.fileList.length; j++) {console.log(j)}
        //获取图片详细信息
        wx.getImageInfo({
          src: that.data.fileList[0],
          success: (ress) => {
            var ctx = wx.createCanvasContext('firstCanvas')
            //真是宽高比例
            var ratio = ress.width / ress.height
            var viewWidth = 700;         //设置图片显示宽度
            var viewHeight = 700 / ratio;
            that.setData({
              canvasHeight: viewHeight,
              canvasWidth: viewWidth
            })
            console.log(that.data.canvasHeight, that.data.canvasWidth)
            //将图片src放到cancas内，宽高为图片大小
            ctx.drawImage(that.data.fileList[0], 0, 0, that.data.canvasWidth, that.data.canvasHeight)
            ctx.setFontSize(50) //注意：设置文字大小必须放在填充文字之前，否则不生效
            ctx.setFillStyle('#F8F8FF')
            ctx.setGlobalAlpha(0.3)
            var text = "@华西口腔放射科"
            ctx.fillText(text, (that.data.canvasWidth - ctx.measureText(text).width) / 2, that.data.canvasHeight / 2)
            setTimeout(function () {
              ctx.draw(false, function () {
                wx.canvasToTempFilePath({
                  canvasId: 'firstCanvas',
                  destWidth: that.data.canvasWidth,
                  destHeight: that.data.canvasHeight,
                  // width: that.data.canvasHeight,
                  //height: that.data.canvasWidth,
                  success: (res) => {
                    //  console.log(res.tempFilePath)
                    wx.showToast({
                      title: '智能检测中',
                      icon: "none",
                    })
                    // 将图片上传至云存储空间
                    wx.cloud.uploadFile({
                      // 指定要上传的文件的小程序临时文件路径
                      cloudPath: that.timetostr(new Date()),
                      filePath: res.tempFilePath,
                      // 成功回调
                      success: res => {

                        var tempres = res.fileID
                        wx.cloud.callFunction({
                          name: 'imgsec',
                          data: {
                            fileID: res.fileID
                          }
                        }).then(res => {
                          console.log("检测结果", res.result);
                          if (res.result.errCode == 0) {
                            that.data.images.push(tempres)
                            console.log("图片正常")
                            wx.hideToast()
                            wx.showToast({
                              title: '检测通过',
                              icon: "none",
                            })
                          } else if (res.result.errCode == 87014) {
                            db.collection('minganxinxi').add({
                              data: {
                                username: app.globalData.username,
                                usernumber: app.globalData.usernumber,
                                minganxinxi: tempres
                              }
                            })
                            wx.showToast({
                              icon: 'none',
                              title: '图片违规，后台已记录本次操作',
                              duration: 1500
                            })
                            that.data.sec = false
                          }
                          else if (!res.result) {
                            wx.showToast({
                              title: '图片检测失败请重试'
                            })
                          }
                        })
                      },
                    })
                    that.setData({
                      canvasHeight: 0,
                      canvasWidth: 0
                    })
                  },
                  fail: (e) => {
                    console.log(e)
                  }
                })
              })
            }, 500) //延迟时间 ms

          }
        })


      }
    })
  },
  /**
   * 图片路径格式化
   */

  timetostr(time) {
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var filename = "影像图片/"; 
    var str = filename + randnum + "_" + time.getMilliseconds() + ".png";
    return str;
  },

  /**
   * 发布
   */
  formSubmit: function (e) {
    var that = this
    console.log('图片：', that.data.images[0])
    that.data.daishangchuanimages={"photopath1":that.data.images[0],"photopath2":that.data.images[1]}
    //this.data.content = e.detail.value['input-content'];
    if (that.data.canIUse) {
      console.log(that.data.daishangchuanimages.photopath1)
      if (that.data.daishangchuanimages.photopath1) {
        that.data.dangqianimages.push(that.data.daishangchuanimages)
console.log(that.data.dangqianimages)
        setTimeout(function () {
          that.saveDataToServer();
        },500)
      }  
      else {
        wx.showToast({
          icon: 'none',
          title: '请等候图片处理或请检查内容',
        })
      }
    } else {
      this.jugdeUserLogin();
    }
  },
  /**
   * 保存到发布集合中
   */
  saveDataToServer: function (event) {
    var that = this
    if(that.data.sec){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
        jihe: that.data.jihe,
        id: that.data.jiheid,
        mingcheng: 'yingxiangziliao',
        photopath: that.data.dangqianimages
      },
      success: function (res) {
        console.log("更新成功", res)
        wx.showToast({
          title: '发布成功',
          duration: 1000
        })
        // 保存到发布历史

        // 清空数据
        that.data.images = [];

        that.setData({
          images: [],
        })
        that.showTipAndSwitchTab();
      },
      fail: console.error
    })

    }else{
      wx.showToast({
        title: '请退出重试',
        icon: "none"
      })
    }
  },
  /**
   * 添加成功添加提示，切换页面
   */
  showTipAndSwitchTab: function (event) {
    wx.showToast({
      title: '发布成功',
    })
    wx.redirectTo({
      url: '../../pages/jiaoshijiaoxuejiemian/jiaoshijiaoxuejiemian',
    })
  },
  /**
   * 删除图片
   */
  removeImg: function (event) {
    var that = this
    var position = event.currentTarget.dataset.index;
    this.data.images.splice(position, 1);
    that.data.fileList.splice(position, 1)
    // 渲染图片
    that.setData({
      images: that.data.images,
      fileList: that.data.fileList
    })
  },
  // 预览图片
  previewImg: function (e) {
    var that = this
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.fileList[index],
      //所有图片
      urls: this.data.fileList
    })
  },



  /**
   * 判断用户是否登录
   */
  jugdeUserLogin: function (event) {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {

              that.data.user = res.userInfo;
              console.log(that.data.user)
            }
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})