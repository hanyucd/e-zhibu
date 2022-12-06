// pages/post-tp/post-tp.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempImgList: [],
    uploadpProgress: 0,
    type: "-1", //0 - 思想汇报,1 - 活动心得,2 - 邮件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      this.setData({ type: options.type })
    }
  },

  onUpdateImg(){
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
            if (suffix != ".jpg" && suffix != ".png"){
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
          fail(res){
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

  onClickDoneBtn(e){
    var page = this;
    if(page.data.type == "-1") return;
    wx.showModal({
      title: '确定要提交吗?',
      content: '提交后内容将不可编辑,请确认无误',
      success(res) {
        if (res.confirm) {
          //仅上传云文件ID
          var tempFileIdList = [];
          page.data.tempImgList.forEach(item => {
            if(!item.isDelete) tempFileIdList.push(item.fileID);
          });
          if (e.detail.value.content == "" || tempFileIdList.length < 1) {
            wx.showModal({
              title: '提交失败',
              content: '请先填写内容并上传图片',
              showCancel: false
            });
            return;
          }
          if(page.data.type != "2"){
            db.collection('w_apply_list').add({
              data: {
                content: e.detail.value.content,
                imgs: tempFileIdList,
                type: page.data.type,
                user_id: wx.getStorageSync("_id"),
                username: wx.getStorageSync("userInfo")[0].username,
                uploadDate: db.serverDate()
              }
            })
              .then(res => {
                console.log(res)
                wx.navigateBack({ delta: 1 });
                wx.showModal({
                  title: '提交成功',
                  content: '请耐心等待审核通过',
                  showCancel: false
                });
              })
              .catch(console.error)
          }else{
            db.collection('letters').add({
              data: {
                title: '支部信箱 - 邮件',
                time: wx.getStorageSync("userInfo")[0].username,
                content: e.detail.value.content,
                images: tempFileIdList,
                user_id: wx.getStorageSync("_id")
              }
            })
              .then(res => {
                console.log(res)
                wx.navigateBack({ delta: 1 });
                wx.showModal({
                  title: '提交成功',
                  content: '现在你可以在【我的-我的咨询/投诉】查看本次提交的内容',
                  showCancel: false
                });
              })
              .catch(console.error)
          }
        }
      }
    })
  },

  onDeleteImg(e){
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

  onPreviewImg(e){
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