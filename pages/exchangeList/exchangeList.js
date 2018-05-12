// pages/exchangeList/exchangeList.js
// var app = getApp();
var http = require('../../utils/httpHelper.js');
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值 1虚拟 2实物 3全部
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [{ //假数据

    }],
    exchangeList:[], //兑换记录列表
    freeMoney:0, //累计免单金额
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
      that.setData({
        currentTab: cur
      });
      that.getOrderList();
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

    that.getOrderList();
  },

  getOrderList:function(){
    var that  = this;
    http.httpPost('myexchange', { 
       acer_type: that.data.currentTab,
       member_id: wx.getStorageSync('member_id') 
      }, function (res) {
      that.setData({
        exchangeList: res.data.acer_goods,
        freeMoney: res.data.free_money
      });
    })
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  }


  // footerTap: app.footerTap
})