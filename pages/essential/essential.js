// pages/essential/essential.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:'', //banner图 - LQ
    goodsList:[], //商品列表 - LQ
    limit: 10,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
     this.getBanner(),
     this.getGoodsList()
  },
  getBanner:function(){
    var that = this;
    //应季必备banner图 - 20180109 - LQ
    http.httpPost('season_banner', {
      member_id: wx.getStorageSync('member_id')
    }, function (res) {
      that.setData({
        banner: res.data.banner[0]['banner_image']
      });
    });
  },
  getGoodsList:function(){
  var that = this;
  //应季必备商品 - 20180109 - LQ
  http.httpPost('seasonindex', {
    member_id: wx.getStorageSync('member_id'),
    page:that.data.page,
    limit:that.data.limit
  }, function (res) {
    var goodsList = that.data.goodsList.concat(res.data.season_products)
    that.setData({
      goodsList: goodsList
    });
    wx.hideLoading();
  });
},


  /**
   * 跳转商品详情 - 20180115 - LQ
   */
  toGoodsDetail:function(e){
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id=' + goods_id,
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.setData({
      banner: '',
      goodsList: [],
      limit: 10,
      page: 1
    });
    this.getBanner(),
    this.getGoodsList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var page = this.data.page + 1
    this.setData({
      page: page
    })
    this.getGoodsList()
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
})