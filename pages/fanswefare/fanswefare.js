// pages/exchangeList/exchangeList.js
var http = require('../../utils/httpHelper.js');
// var app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    page1:1,
    page2:1,
    page3:1,
    page4:1,
    limit:20,
    banner:'', //粉丝福利banner
    sortList:[], //排序方式
    goodsList1:[], //商品列表
    goodsList2: [],
    goodsList3: [],
    goodsList4: [],
    scrollTop:0,
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var that = this;
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur,
      });
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 123 * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });

    

   
    that.getSort()
    that.getBanner()
    //商品 - 20180108 - LQ
    that.getGoodsList1();
    that.getGoodsList2();
    that.getGoodsList3();
    that.getGoodsList4();

  },
  //banner - 20180108 - LQ
  getBanner:function(){
    var that = this;
    http.httpPost('fanswelfare_banner', {
      member_id: wx.getStorageSync('member_id')
    }, function (res) {
      that.setData({
        banner: res.data.banner[0]['banner_image']
      });
    });
  },
   //排序方式 - 20180108 - LQ
  getSort:function(){
    var that = this;
    http.httpPost('fanswelfare_type', {
      member_id: wx.getStorageSync('member_id')
    }, function (res) {
      that.setData({
        sortList: res.data.sorts
      });
    });
  },
  getGoodsList1:function(){
    var that = this;
    http.httpPost('fanswelfare_product', { 
      sorts_type: 5,
       member_id: wx.getStorageSync('member_id') ,
       page:that.data.page1,
       limit:that.data.limit
      },function(res){
        var goodsList1 = that.data.goodsList1.concat(res.data.goods_list)
      that.setData({
        goodsList1: goodsList1 
      });
      wx.hideLoading();
    });
  },
  getGoodsList2: function () {
    var that = this;
    http.httpPost('fanswelfare_product', {
      sorts_type: 6,
      member_id: wx.getStorageSync('member_id'),
      page: that.data.page2,
      limit: that.data.limit
    }, function (res) {
      var goodsList2 = that.data.goodsList2.concat(res.data.goods_list)
      that.setData({
        goodsList2: goodsList2
      });
      wx.hideLoading();
    });
  },
  getGoodsList3: function () {
    var that = this;
    http.httpPost('fanswelfare_product', {
      sorts_type: 7,
      member_id: wx.getStorageSync('member_id'),
      page: that.data.page3,
      limit: that.data.limit
    }, function (res) {
      var goodsList3 = that.data.goodsList3.concat(res.data.goods_list)
      that.setData({
        goodsList3: goodsList3
      });
      wx.hideLoading();
    });
  },
  getGoodsList4: function () {
    var that = this;
    http.httpPost('fanswelfare_product', {
      sorts_type: 8,
      member_id: wx.getStorageSync('member_id'),
      page: that.data.page4,
      limit: that.data.limit
    }, function (res) {
      var goodsList4 = that.data.goodsList4.concat(res.data.goods_list)
      that.setData({
        goodsList4: goodsList4
      });
      wx.hideLoading();
    });
  },
  onPullDownRefresh: function () {
    var that = this
    this.setData({
      banner: "", //banner图
      sortList: [], //抢购时间列表
      goodsList1: [], //抢购商品
      goodsList2: [], //抢购商品
      goodsList3: [], //抢购商品
      goodsList4: [], //抢购商品
      page1: 1, //页码
      page2: 1,
      page3: 1,
      page4: 1,
      limit: 10, //每页显示条数
    });
    that.getSort()
    that.getBanner()
    //抢购商品 - 20180108 - LQ
    that.getGoodsList1();
    that.getGoodsList2();
    that.getGoodsList3();
    that.getGoodsList4();
    setTimeout(wx.stopPullDownRefresh,5000)
  },
  lower: function (e) {
    var cur = this.data.currentTab
    switch (cur) {
      case 0:
        var page1 = this.data.page1 + 1
        var that = this
        this.setData({
          page1: page1
        })
        that.getGoodsList1();
        break;
      case 1:
        var page2 = this.data.page2 + 1
        var that = this
        this.setData({
          page2: page2
        })
        that.getGoodsList2();
        break;
      case 2:
        var page3 = this.data.page3 + 1
        var that = this
        this.setData({
          page3: page3
        })
        that.getGoodsList3();
        break;
      case 3:
        var page4 = this.data.page4 + 1
        var that = this
        this.setData({
          page4: page4
        })
        that.getGoodsList4();
        break;
    }
  },
  toTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
  toGoodsDetail: function(e){
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id=' + goods_id,
    })
  }
})