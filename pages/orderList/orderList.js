// pages/orderList/orderList.js
var http = require('../../utils/httpHelper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值 1虚拟 2实物 3全部
    scrollLeft: 0, //tab标题的滚动条位置
    orderList: [], //订单列表 - LQ
    isShow:false,
    show:false,
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
    if(cur=="0"){
      this.setData({
        isShow:false
      })
    }else{
      this.setData({
        isShow: true
      })
    }
    if (this.data.currentTaB == cur) { return false; }
    else {
      that.setData({
        currentTab: cur
      });
      if (cur > 0){
        that.getOrderList(cur);
      }
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
  onLoad: function (e) {
    var type =e.type
    var that = this;
    if (type == "0") {
      this.setData({
        isShow: false
      })
    } else {
      this.setData({
        isShow: true
      })
    }
    if (this.data.currentTaB == type) { return false; }
    else {
      that.setData({
        currentTab: type
      });
      if (type > 0) {
        that.getOrderList(type);
      }
    }
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc,
          currentTab: type
        });
      }
    });
  },

  //查询订单列表 - 20180109 - LQ
  getOrderList:function(order_type){
    var that = this;
    http.httpPost('myOrder', {
        back_status:order_type,
        member_id: wx.getStorageSync('member_id') 
      },function(res){
      if(res.data.order_list.length==0){
        that.setData({
          orderList: res.data.order_list,
          show:false
        });
      }else{
        that.setData({
          orderList: res.data.order_list,
          show: true
        });
      }
      
      
    });
  },

  //添加订单 - 20180111 - LQ
  formSubmit:function(e){
    var that = this;
    var orderNum = e.detail.value.orderNum;
    http.httpPost('addOrder',{
        order_num:orderNum,
        member_id: wx.getStorageSync('member_id') 
      },function(res){
      if(res.code == 200){
        wx.showModal({
          content : res.data.message,
          showCancel : false
        })
      }else{
        wx.showModal({
          content: res.error,
          showCancel : false
        })
      }
    });
  },
  toShare:function(e){
    var num = e.target.dataset.num
    wx.navigateTo({
      url: '../share/share?num='+num,
    })
  },
  onPullDownRefresh: function () {
    // var that = this
    // this.setData({
    //   goodsList1: [], //抢购商品
    //   goodsList2: [], //抢购商品
    //   goodsList3: [], //抢购商品
    //   goodsList4: [], //抢购商品
    // });
    // //抢购商品 - 20180108 - LQ
    // that.getPanicList1();
    // that.getPanicList2();
    // that.getPanicList3();
    // that.getPanicList4();
    // wx.stopPullDownRefresh()
  },
  lower: function (e) {
    console.log('上拉')
    // var cur = this.data.currentTab
    // console.log(cur)
    // switch (cur) {
    //   case 0:
    //     var page1 = this.data.page1 + 1
    //     var that = this
    //     that.getPanicList1();
    //     break;
    //   case 1:
    //     var page2 = this.data.page2 + 1
    //     var that = this
    //     that.getPanicList2();
    //     break;
    //   case 2:
    //     var page3 = this.data.page3 + 1
    //     var that = this
    //     that.getPanicList3();
    //     break;
    //   case 3:
    //     var page4 = this.data.page4 + 1
    //     var that = this
    //     that.getPanicList4();
    //     break;
    // }
  },
  toTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
})