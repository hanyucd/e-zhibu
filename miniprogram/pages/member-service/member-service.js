// pages/edu/edu.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_list: {},
    main_fun_list: [
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '结对帮扶',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '党费缴纳',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      }
    ],
    child_fun_list: [
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '党旗',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '党徽',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '党章',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '入党誓词',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '两学一做',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '十九大',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '党员基础知识',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
      {
        nav_url: '/pages/article-detail/article-detail?aid=5c0cd1ff795243a05b668218',
        text: '发展党员工作流程',
        image_url: 'cloud://dfxx-xxezb-0cd5c6.6466-dfxx-xxezb-0cd5c6/Images/Drt_Navs/drtnav_1.svg'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.pageOnLoad(this);

    this.setData({
      edu_banner_list: wx.getStorageSync('mainInfo').edu_banners,
    });

  },

  toMiniProgram: function (event) {

    wx.navigateToMiniProgram({
      appId: 'wxebadf544ddae62cb',
      path: 'pages/survey/index?sid=5609250&hash=e522',
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log('success');
      }
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