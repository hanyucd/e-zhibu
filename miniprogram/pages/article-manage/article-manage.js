// pages/post-tp/post-tp.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempImgList: [],
    uploadpProgress: 0,
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '开始输入...',
    _focus: false,
    displayArray: ['支部生活 + 红色掠影', '支部生活', '党务公开', '公告',
      '党规党章', '每日一习语', '每周一党课', '最新时事', '党建-不忘初心，牢记使命', '党建-十九大',
      '典型榜样', '身边榜样', '学习-党章党史', '学习-专题教育', '学习-最新时事','学习-政策法规'
    ],
    array: [
      {
        id: '1',
        name: '支部生活 + 红色掠影'
      },
      {
        id: '2',
        name: '支部生活'
      },
      {
        id: '3',
        name: '党务公开'
      },
      {
        id: '4',
        name: '公告'
      },
      {
        id: '5',
        name: '党规党章'
      },
      {
        id: '8',
        name: '每日一习语'
      },
      {
        id: '9',
        name: '每周一党课'
      },
      {
        id: '10',
        name: '最新时事'
      },
      {
        id: '20',
        name: '不忘初心，牢记使命',
        group: '不忘初心，牢记使命'
      },
      {
        id: '21',
        name: '十九大',
        group: '十九大'
      },
      {
        id: '11',
        name: '典型榜样'
      },
      {
        id: '12',
        name: '身边榜样'
      },
      {
        id: '22',
        name: '党章党史',
        group: '党章党史'
      },
      {
        id: '23',
        name: '专题教育',
        group: '专题教育'
      },
      {
        id: '24',
        name: '最新时事',
        group: '最新时事'
      },
      {
        id: '26',
        name: '政策法规',
        group: '政策法规'
      }
    ],
    index: -1,
    date: "",
    title: "",
    source: "",
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindPickerDate: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: wx.getStorageSync('a_manager_index')
    });
    if (page.data.index == undefined) {
      this.setData({
        index: 0
      });
    }
  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  onUpdateImg() {
    var page = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        wx.getFileInfo({
          filePath: tempFilePaths[0],
          success(res) {
            if (res.size > 2048000) {
              wx.showModal({
                title: '上传失败',
                content: '文件大小应小于2mb',
                showCancel: false
              })
              return;
            }
            /*console.log("文件大小:" + res.size)
            console.log("文件MD5:" + res.digest)
            console.log("文件URL:" + tempFilePaths[0])*/
            var suffix = tempFilePaths[0].substr(tempFilePaths[0].length - 4, 4);
            if (suffix != ".jpg" && suffix != ".png") {
              wx.showModal({
                title: '上传失败',
                content: '仅支持上传.png或.jpg文件',
                showCancel: false
              })
              return;
            }
            wx.cloud.uploadFile({
              cloudPath: 'UploadImages/user/' + res.digest.substr(0, 2) + '/' + res.digest + suffix,
              filePath: tempFilePaths[0], // 小程序临时文件路径
              success: res => {
                // get resource ID
                // console.log(res.fileID)
                let tempList = page.data.tempImgList;
                tempList.push({
                  imgUrl: tempFilePaths[0],
                  fileID: res.fileID
                });
                page.setData({
                  tempImgList: tempList
                });
              },
              fail: err => {
                // handle error
                console.log(error)
              }
            }).onProgressUpdate(res => {
              page.setData({
                uploadpProgress: res.progress
              });
            });
          },
          fail(res) {
            wx.showModal({
              title: '上传失败',
              content: '文件可能已损坏或不存在',
              showCancel: false
            });
          }
        });
      }
    })
  },

  onDeleteImg(e) {
    var id = e.currentTarget.dataset.id;
    var tempList = this.data.tempImgList;
    wx.cloud.deleteFile({
      fileList: [tempList[id].fileID]
    });
    tempList[id].isDelete = true;
    this.setData({
      tempImgList: tempList
    });
  },

  onPreviewImg(e) {
    var id = e.currentTarget.dataset.id;
    var tempList = this.data.tempImgList;
    var array = new Array(tempList[id].imgUrl);
    wx.previewImage({
      current: tempList[id].imgUrl,
      urls: array
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    function compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)

      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }

      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }

      return 0
    }

    const version = wx.getSystemInfoSync().SDKVersion

    if (compareVersion(version, '2.7.0') >= 0) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false
      })
    }

  },

  onClickDoneBtn(e) {
    var page = this;
    if (page.data.index == -1) {
      wx.showModal({
        title: '提交失败',
        content: '请先选择板块',
        showCancel: false
      });
      return;
    }
    if (e.detail.value.title == "" || page.data.date == "") {
      wx.showModal({
        title: '提交失败',
        content: '请先填写文章标题/发布日期',
        showCancel: false
      });
      return;
    }
    if (e.detail.value.content == "") {
      wx.showModal({
        title: '提交失败',
        content: '请先填写内容',
        showCancel: false
      });
      return;
    }
    wx.showModal({
      title: '确定要提交吗?',
      content: '提交后内容将不可编辑,请确认无误',
      success(res) {
        if (res.confirm) {
          page.editorCtx.getContents({
            success: function (res) {
              var newText = res.text.replace(/ /g, '&emsp;');
              newText = newText.replace(/\n/g, '<br />');
              //仅上传云文件ID
              var tempFileIdList = [];
              page.data.tempImgList.forEach(item => {
                if (!item.isDelete) tempFileIdList.push(item.fileID);
              });
              db.collection('articles').add({
                data: {
                  title: e.detail.value.title,
                  time: page.data.date,
                  content: newText,
                  images: tempFileIdList,
                  source: e.detail.value.source,
                  type: page.data.array[page.data.index].id,
                  audio: page.data.index == 5 || page.data.index == 6 ? e.detail.value.audio : '其他',
                  group: page.data.array[page.data.index].group ? page.data.array[page.data.index].group : null
                }
              })
                .then(res => {
                  console.log(res)
                  wx.navigateBack({
                    delta: 1
                  });
                  wx.showModal({
                    title: '发布成功',
                    content: '现在你可以在' + page.data.array[page.data.index].name + '板块查看本次发布的内容',
                    showCancel: false
                  });
                })
                .catch(console.error)
            }
          });
        }
      }
    })
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
    wx.setStorageSync('a_manager_index', this.data.index);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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