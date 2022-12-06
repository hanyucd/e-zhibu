// pages/check-video/check-video.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDetail: false,
    activeIndex: null,
    videoList: [],
    disableList: [],
    article_list: [],
    readCount: 0,
    noMoreData: false,
    currentPlayTime: 1,
    filterType: "0",
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    if(options.type) page.data.filterType = options.type;
    db.collection('users').where({
      _id: wx.getStorageSync('_id')
    }).field({
      video_list: true
    }).get().then(res => {
      page.data.disableList = res.data[0].video_list;
      /**
       * video_list - Type
       * 0:默认(即不区分板块显示) 1:学习十九大 2:党规党章
       * 
       * article_list - Type
       * 5:党规党章
       */
      page.loadVideoList();
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    });
  },

  onClickLoadMore: function () {
    this.loadVideoList();
  },

  loadVideoList(){
    var page = this;
    wx.showLoading({
      title: "正在加载",
      mask: true,
    });
    db.collection('video_list').where({
      type: page.data.filterType
    }).skip(page.data.readCount).get().then(res => {
      if (res.data.length == 0) {
        wx.hideLoading();
        page.setData({ noMoreData: true });
        return;
      }
      var tempList = page.data.videoList;
      res.data.forEach(item => {
        if (page.data.disableList.indexOf(item._id) != -1) {
          item.isDisable = true;
        }
        if(item.type == page.data.filterType) tempList.push(item);
      })
      page.data.readCount = page.data.readCount + 20;
      page.setData({
        videoList: tempList
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    });
  },

  showDetail(e){
    var page = this;
    wx.navigateTo({
      url: '/pages/article-detail/article-detail?aid=' + page.data.article_list[e.currentTarget.dataset.index]._id,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video')
  },

  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },

  videoEndCallback: function(e) {
    var page = this;
    console.log('视频播放完毕');
    console.log(e);
    if (page.data.videoList[page.data.activeIndex].isDisable){
      wx.showModal({
        title: '提示',
        content: '视频观看完成,但由于已经看过,将不会获得积分',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack(1);
          }
        }
      });
      return;
    }

    wx.showModal({
      title: '提示',
      content: '视频观看完成,积分+1',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.navigateBack(1);
          db.collection('apply_list').add({
            data: {
              content: "[观看视频]" + page.data.videoList[page.data.activeIndex].title,
              uploadDate: db.serverDate(),
              user_id: wx.getStorageSync('_id')
            }
          }).catch(console.error);
          wx.cloud.callFunction({
            name: 'addUserPoints',
            data: {
              id: wx.getStorageSync('_id'),
              video_id: page.data.videoList[page.data.activeIndex]._id
            }
          }).then(res => {
            console.error('[云函数] [addUserPoints] 调用成功：', res)
          }).catch(err => {
            console.error('[云函数] [addUserPoints] 调用失败：', err)
          })
        }
      }
    });
  },

  onClickGoBtn(e){
    //this.data.currentPlayTime = 1;
    this.setData({
      showDetail: true,
      activeIndex: e.currentTarget.dataset.index
    });
  },

  backBtn(){
    this.videoContext.stop();
    this.setData({
      showDetail: false
    });
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      that.data.filterType = that.data.currentTab.toString();
      that.data.videoList = [];
      that.data.readCount = 0;
      that.setData({ noMoreData: false });
      that.loadVideoList();
    }
  },

  /*onTimeUpdate(e){
    if (Math.abs(e.detail.currentTime - this.data.currentPlayTime) > 1){
      this.videoContext.seek(this.data.currentPlayTime);
    }else{
      this.data.currentPlayTime = e.detail.currentTime;
    }
  },*/

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.videoContext.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.videoContext.stop();
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