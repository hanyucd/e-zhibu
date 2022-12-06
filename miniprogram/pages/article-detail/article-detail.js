// pages/article-detail/article-detail.js
const db = wx.cloud.database();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        isPlayAudio: false,
        audioLength: 0,
        currentAudioPlayProcess: 0,
        isAdmin: null,
        isArticle: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var page = this;
        if (options.aid || options.lid) {
            page.setData({
                isAdmin: wx.getStorageSync('date_time_type'),
                isArticle: options.aid ? true : false
            });
            wx.showLoading({
                title: "正在加载",
                mask: true,
            });
            db.collection(options.aid ? 'articles' : 'letters').where({
                _id: options.aid ? options.aid : options.lid
            }).get().then(res => {
                if (res.data.length == 0) {
                    wx.navigateBack(1);
                    return;
                }
                var localDate = new Date(res.data[0].time);
                var dateStr = "";
                dateStr += localDate.getFullYear() + "-";
                dateStr += localDate.getMonth() + 1 + "-";
                dateStr += localDate.getDate() + "";
                res.data[0].time = dateStr;
                page.setData({
                    list: res.data[0]
                });
                if (res.data[0].audio) {
                    page.audioContext = wx.createInnerAudioContext();
                    page.audioContext.src = res.data[0].audio;
                    page.audioContext.onTimeUpdate(page.onAudioTimeUpdate);
                    page.audioContext.onPlay(page.onAudioPlay);
                    page.audioContext.onEnded(page.onAudioEnded);
                    page.audioContext.onStop(page.onAudioEnded);
                }
                wx.hideLoading();
            }).catch(err => {
                console.error(err);
                wx.hideLoading();
            })
        } else if (options.list) {
            page.setData({
                list: JSON.parse(options.list)
            });
        }
    },

    sliderChanging(e) {
        this.audioContext.seek(e.detail.value);
        if (e.detail.value == this.data.audioLength)
            this.setData({
                currentAudioPlayProcess: 0
            });
    },

    deleteArticle() {
        var page = this;
        wx.showModal({
            title: '确定要删除吗?',
            content: '删除后不可撤销,请确认无误',
            success(res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'removeArticles',
                        data: {
                            id: page.data.list._id
                        }
                    }).then(res => {
                        console.error('[云函数] [removeArticles] 调用成功：', res);
                        wx.navigateBack({
                            delta: 2
                        });
                    }).catch(err => {
                        console.error('[云函数] [removeArticles] 调用失败：', err)
                    })
                }
            }
        });
    },

    onAudioEnded() {
        this.setData({
            isPlayAudio: false,
            currentAudioPlayProcess: 0
        });
    },

    onAudioTimeUpdate() {
        this.setData({
            currentAudioPlayProcess: this.audioContext.currentTime
        });
    },

    onAudioPlay() {
        if (this.data.audioLength == 0) {
            this.setData({
                audioLength: this.audioContext.duration
            });
        }
    },

    playAudio() {
        this.audioContext.play();
        this.togglePlayeState();
    },

    pauseAudio() {
        this.audioContext.pause();
        this.togglePlayeState();
    },

    togglePlayeState() {
        this.setData({
            isPlayAudio: !this.data.isPlayAudio
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        if (this.audioContext) this.audioContext.stop();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        if (this.audioContext) this.audioContext.stop();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})