// pages/user-list/user-list.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title_bar_list:[],
    content_list: [],
    noMoreData: false,
    readCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    if (options.type){
      page.loadUserList();
    }
  },

  onClickLoadMore(){
    this.loadUserList();
  },

  loadUserList(){
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    var page = this;
    db.collection('users').where({
      part_member: _.eq(false),
      admin: _.eq("0")
    }).field({
      username: true,
      classname: true
    }).skip(page.data.readCount).get().then(res => {
      if (res.data.length == 0) {
        wx.hideLoading();
        page.setData({ noMoreData: true });
        return;
      }
      var tempList = page.data.content_list;
      res.data.forEach(item => {
        tempList.push(item);
      });
      page.setData({
        readCount: page.data.readCount + 20,
        content_list: tempList
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    });
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