// pages/user-points/user-points.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    points: '正在获取',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _id = wx.getStorageSync("_id");
    var tempList = [], tList = [];

    db.collection('w_apply_list').where({
      user_id: _id
    }).field({
      content: true,
      uploadDate: true
    }).get().then(res => {
      res.data.forEach(item => {
        if (item.uploadDate) item.uploadDate = new Date(item.uploadDate).toLocaleString();
        tList.push(item);
      })
      tempList.push(tList);
      db.collection('apply_list').where({
        user_id: _id
      }).field({
        content: true,
        uploadDate: true
      }).get().then(res => {
        tList = [];
        res.data.forEach(item => {
          if (item.uploadDate) item.uploadDate = new Date(item.uploadDate).toLocaleString();
          tList.push(item);
        })
        tempList.push(tList);
        db.collection('deny_list').where({
          user_id: _id
        }).field({
          content: true,
          uploadDate: true
        }).get().then(res => {
          tList = [];
          res.data.forEach(item => {
            if (item.uploadDate) item.uploadDate = new Date(item.uploadDate).toLocaleString();
            tList.push(item);
          })
          tempList.push(tList);
          this.setData({
            list: tempList,
            points: wx.getStorageSync('points'),
          });
        })
      })
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