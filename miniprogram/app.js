//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'tyttest-vqzij',
        traceUser: true,
      })
    }

  this.checkForUpdate()
   this.globalData = {
        //用户ID
        userId: '',
        usershenfenid:"",
        username: "",
        usershenfen: "",
        usernumber:"",
        successusername:"",
        successusernumber: "",
        successusershenfen: "",
     tabBar: {
       "color": "#9E9E9E",
       "selectedColor": "#1296db",
       "backgroundColor": "#fff",
       "borderStyle": "#ccc",
       "list": [
         {
           "pagePath": "/pages/loginsuccess/loginsuccess",
           "text": "菜单",
           "iconPath": "/images/caidan1.png",
           "selectedIconPath": "/images/caidan2.png",
           "clas": "menu-item",
           "selectedColor": "#000000",
           active: true
         },
         {
           "pagePath": "/pages/gerenxinxi/gerenxinxi",
           "text": "我的",
           "iconPath": "/images/user1.png",
           "selectedIconPath": "/images/user2.png",
           "selectedColor": "#000000",
           "clas": "menu-itemwode",
           active: false
         }
       ],
       "position": "bottom"
      }
    
  }
  },
  checkForUpdate: function () {

    if (wx.canIUse("getUpdateManager")) {

      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {

        // console.log(res.hasUpdate);

        // 请求完新版本信息的回调

        if (res.hasUpdate) {

          updateManager.onUpdateReady(function () {

            wx.showModal({

              title: "更新提示",

              content: "新版本已经准备好，是否重启应用？",

              success(res) {

                if (res.confirm) {

                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启

                  updateManager.applyUpdate();

                }

              }

            });

          });

          updateManager.onUpdateFailed(function () {

            // 新的版本下载失败

            wx.showModal({

              title: "已经有新版本了哟~",

              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"

            });

          });

        }

      });

    } else {

      wx.showModal({

        title: "提示",

        content:

          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"

      });

    }

  },
  editTabBar: function () {
    //使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。

    var curPageArr = getCurrentPages();    //获取加载的页面
    var curPage = curPageArr[curPageArr.length - 1];    //获取当前页面的对象
    var pagePath = curPage.route;    //当前页面url
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }

    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true;    //根据页面地址设置当前页面状态    
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
})
