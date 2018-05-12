// pages/shareList/shareList.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    orderList: [], //我的晒单列表
    orderSquareList:[], //晒单广场列表
    list:[]
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
    if (this.data.currentTab == cur) { return false; }
    else {
      that.setData({
        currentTab: cur
      });
      if (cur == 0){
        that.myOrder();
      }
      else if(cur == 1){
        that.orderSquare();
      }
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) {
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
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow:function(){
    this.myOrder();
  },
  toShare:function(e){
    wx.navigateTo({
      url: '../share/share',
    })
  },
  //我的晒单 - 20180111 - LQ
  myOrder:function(){
    var that = this;
    http.httpPost('myShareOrder',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      that.setData({
        list: res.data.my_order
      });
    });
  },
  //晒单广场 - 20180111 - LQ
  orderSquare:function(){
    var that = this;
    http.httpPost('orderSquare',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      that.setData({
        list: res.data.order_square
      });
    });
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  }

})