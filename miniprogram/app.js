//app.js
App({

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.showLoading({
      title: "正在载入数据",
      mask: true,
    });

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('hasUpdate:' + res.hasUpdate)
      wx.hideLoading();
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })

    wx.cloud.callFunction({
      name: 'getMainInfo',
    }).then(res => {
      //cloud转tempUrl
      /*var tempData = res.result.data[0];
      tempData.drtnavbars.forEach(subItem => {
        if (subItem.image_url.indexOf("cloud://") != -1){
          wx.cloud.getTempFileURL({
            fileList: [subItem.image_url],
            success: res => {
              subItem.image_url = res.fileList[0].tempFileURL;
            }
          });
        }
      });*/
      wx.setStorageSync('mainInfo', res.result.data[0]);
    }).catch(err => {
      console.error('[云函数] [mainInfo] 调用失败：', err)
    })

  },

  pageOnLoad: function (page) {
    console.log('--------pageOnLoad----------');
    this.setPageNavbar(page);
  },

  setPageNavbar: function(page){
    const navbar = wx.getStorageSync('mainInfo').navs;

    if(navbar){
      setNavbar(navbar);
    }

    function setNavbar(navbar) {
      var in_navs = false;
      var route = page.route || (page.__route__ || null);
      for (var i in navbar) {
        if (navbar[i].url === "/" + route) {
          navbar[i].active = true;
          in_navs = true;
        } else {
          navbar[i].active = false;
        }
      }
      if (!in_navs) return;
      page.setData({ _navbar: navbar });
    }
  },

});
