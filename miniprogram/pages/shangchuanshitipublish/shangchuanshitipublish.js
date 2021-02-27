 const app = getApp();
const db = wx.cloud.database();
var usershenfen;
var username, time,mingcheng,jihe,ceyankey;
var util = require('../../modules/utils.js');
var colora = [''], colorb = [''], colorc = [''], colord = [''], selectcolor = '#98FB98', nowcolor = "";
var texttigan, texta, textb, textc, textd, texttrueanswer, xuanxiang, isfocus,sec;
Page({
  data: {
    username,
    usershenfen,
    time,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    content: '',
    ceyankey,
    images: [],
    user: {},
    isceyan: false,
    mingcheng,
    jihe,
    isfocus:[],
    texttigan,texta,textb,textc,textd,texttrueanswer,
    xuanxiang:{"A":"","B":"","C":"","D":""},
    fileList: [],
    canvasHeight: 0,
    canvasWidth: 0,
    sec:true
  },
  onLoad: function (options) {
    var that = this
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username })
    that.setData({ usershenfen: app.globalData.usershenfen })
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    that.data.jihe=options.jihe
    console.log( that.data.jihe)
    that.jugdeUserLogin();
  },

  /**
   * 获取填写的内容
   */
  clicktigan: function (event) {
    var that = this
    var focusnow =  'isfocus[' + 0 + ']'
    that.setData({focusnow:true})
    that.data.texttigan = event.detail.value;
  },
  clicka: function (event) {
    var that = this
    var focusnow = 'isfocus[' + 1 + ']'
    that.setData({ focusnow: true })
    that.data.xuanxiang.A = event.detail.value;
  },
  clickb: function (event) {
    var that = this
    var focusnow = 'isfocus[' + 2 + ']'
    that.setData({ focusnow: true })
    that.data.xuanxiang.B= event.detail.value;
  },
  clickc: function (event) {
    var that = this
    var focusnow = 'isfocus[' + 3 + ']'
    that.setData({ focusnow: true })
    that.data.xuanxiang.C = event.detail.value;
  },
  clickd: function (event) {
    var that = this
    var focusnow = 'isfocus[' + 4 + ']'
    that.setData({ focusnow: true })
    that.data.xuanxiang.D = event.detail.value;
  },
  clicktrueanswer: function (event) {
    var that = this
    var focusnow = 'isfocus[' + 5 + ']'
    that.setData({ focusnow: true })
    that.data.texttrueanswer = event.detail.value;
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

  wenzijiance: function () {
    var that = this
    wx.showToast({
      title: '智能检测中',
      icon: "none",
    })
    that.data.content = that.data.texttrueanswer + that.data.texttigan + that.data.xuanxiang.A + that.data.xuanxiang.B + that.data.xuanxiang.C + that.data.xuanxiang.D
    wx.cloud.callFunction({
      name: 'msgsec',
      data: {
        text: that.data.content
      }
    }).then((res) => {
      console.log("检测结果", res.result);
      if (!that.data.content) { this.saveDataToServer(); }
      if (res.result.errCode == 0) {
        this.saveDataToServer();
        console.log("文字正常")
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
            minganxinxi: that.data.content
          }
        })
        wx.showToast({
          icon: 'none',
          title: '文字违规，后台已记录本次操作',
          duration: 1000
        })
        that.data.sec = false
      }
    })
  },
  /**
   * 图片路径格式化
   */

  timetostr(time) {
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var filename = "发布试题图片/"; 
    var str = filename + randnum + "_" + time.getMilliseconds() + ".png";
    return str;
  },

  /**
   * 发布
   */
  submit: function (e) {
    var that = this
    console.log('图片：', that.data.images)
    console.log(that.data.texttrueanswer, that.data.xuanxiang)
    if (that.data.canIUse) {
      if ((that.data.texttrueanswer == "A" || that.data.texttrueanswer == "B" || that.data.texttrueanswer == "C" || that.data.texttrueanswer == "D")&&that.data.texttigan.trim() != '' && that.data.texttrueanswer.trim() != '') {
        this.wenzijiance();
      } else {
        wx.showToast({
          icon: 'none',
          title: '请检查内容或等候图片处理',
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
    db.collection(that.data.jihe).add({
      // data 字段表示需新增的 JSON 数据
      data: {
        option:that.data.xuanxiang,
        trueanswer:that.data.texttrueanswer,
        fabutime: that.data.time,
        photopath: that.data.images,
        tigan:that.data.texttigan,
        fabuname: that.data.username,
      },
      success: function (res) {
        // 保存到发布历史

        // 清空数据
        that.data.xuanxiang = "";
        that.data.images = [];

        that.setData({
          textContent: '',
          images: [],
        })
        that.showTipAndSwitchTab();
      },
    })}
    else{
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