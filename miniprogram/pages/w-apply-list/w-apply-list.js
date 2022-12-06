// pages/w-apply-list/w-apply-list.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    w_apply_list: [],
    checkTab: 0,
    showDetail: false,
    checkItemIndex: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadList();
  },

  toggleTab(e){
    if (e.currentTarget.dataset.id == this.data.checkTab) return;
    this.setData({
      checkTab: e.currentTarget.dataset.id
    });
  },

  loadList(){
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    var page = this;
    wx.cloud.callFunction({
      name: 'getWaitApplyList',
      data: {
        skip: 0
      }
    }).then(res => {
      console.error('[云函数] [getWaitApplyList] 调用成功：', res)
      var tempList = [[], []];
      res.result.data.forEach(item => {
        if (item.uploadDate) item.uploadDate = new Date(item.uploadDate).toLocaleString();
        tempList[item.type].push(item);
      })
      page.setData({
        w_apply_list: tempList
      });
      wx.hideLoading();
    }).catch(err => {
      console.error('[云函数] [getWaitApplyList] 调用失败：', err)
      wx.hideLoading();
    })
    /*db.collection('w_apply_list').field({
      content: true,
      imgs: true,
      type: true,
      user_id: true,
      username: true,
      uploadDate: true
    }).get().then(res => {
      var tempList = [[], []];
      res.data.forEach(item => {
        if (item.uploadDate) item.uploadDate = new Date(item.uploadDate).toLocaleString();
        tempList[item.type].push(item);
      })
      page.setData({
        w_apply_list: tempList
      });
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });*/
  },

  onClickDetail(e){
    this.setData({ 
      showDetail: true,
      checkItemIndex: e.currentTarget.dataset.id
    });
  },

  onPreviewImg(e) {
    var id = e.currentTarget.dataset.id;
    var tempList = this.data.w_apply_list[this.data.checkTab][this.data.checkItemIndex].imgs;
    wx.previewImage({
      current: tempList[id],
      urls: tempList
    })
  },

  yesBtn(e){
    var page = this;
    wx.showModal({
      title: '确定要通过吗?',
      content: '通过后无法撤销,请确认操作',
      success(res) {
        if (res.confirm) {
          //待操作数组
          let tempList = page.data.w_apply_list[page.data.checkTab][e.currentTarget.dataset.cid];

          db.collection('w_apply_list').doc(tempList._id).get().then(res => {
            page.data.user_id = res.data.user_id;
            db.collection('apply_list').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                _id: res.data._id,
                content: res.data.content,
                imgs: res.data.imgs,
                type: res.data.type,
                uploadDate: res.data.uploadDate,
                user_id: res.data.user_id,
                username: res.data.username
              }
            })
              .then(res => {
                wx.cloud.callFunction({
                  name: 'addUserPoints',
                  data: {
                    id: page.data.user_id
                  }
                }).then(res => {
                  console.error('[云函数] [addUserPoints] 调用成功：', res)
                }).catch(err => {
                  console.error('[云函数] [addUserPoints] 调用失败：', err)
                })

                db.collection('w_apply_list').doc(tempList._id).remove()
                  .then(res => {
                    page.backBtn();
                    page.loadList();
                  })
                  .catch(console.error)
              })
              .catch(console.error)
          });

        }
      }
    });
  },

  noBtn(e){
    var page = this;
    wx.showModal({
      title: '确定要拒绝吗?',
      content: '拒绝后无法撤销,请确认操作',
      success(res) {
        if (res.confirm) {
          //待操作数组
          let tempList = page.data.w_apply_list[page.data.checkTab][e.currentTarget.dataset.cid];

          db.collection('w_apply_list').doc(tempList._id).get().then(res => {
            db.collection('deny_list').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                _id: res.data._id,
                content: res.data.content,
                imgs: res.data.imgs,
                type: res.data.type,
                uploadDate: res.data.uploadDate,
                user_id: res.data.user_id,
                username: res.data.username
              }
            })
              .then(res => {
                console.log(res)
                db.collection('w_apply_list').doc(tempList._id).remove()
                  .then(res => {
                    page.backBtn();
                    page.loadList();
                  })
                  .catch(console.error)
              })
              .catch(console.error)
          });

        }
      }
    });
  },

  backBtn(){
    this.setData({ showDetail: false });
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