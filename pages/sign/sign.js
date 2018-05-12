// pages/sign/sign.js
var http = require('../../utils/httpHelper.js');
var util = require('../../utils/date.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModel:true,
    show:false, //当日是否签到 false未签到 true已签到
    orderShow: true,    
    acer: 0, //签到可获取的元宝数
    signNotes:[], //一周签到情况
    continueDays:0, //连续签到天数
    memberAcer:0, //会员元宝数
    exchangeList:[], //兑换记录
    date:'', //当前日期
  },
  onLoad:function(options){
    var that = this;
    //获取当前签到信息
    that.getTodayReward();
    //获取一周签到情况
    that.weekSign();
    //获取当前日期
    var time = util.formatTime(new Date());
    that.setData({
      date: time
    });
    //兑换记录
    that.exchangeList();
  },
  toAcerstore:function(e){
    wx.navigateTo({
      url: '../acerstore/acerstore',
    })
  },
  toExchangeList:function(){
    wx.navigateTo({
      url: '../exchangeList/exchangeList',
    })
  },
  toShareList:function(){
    wx.navigateTo({
      url: '../shareList/shareList',
    })
  },
  // 点击签到
  sign:function(e){
    var that = this;
    http.httpPost('dosign',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      
      if(res.code == 200){
        //获取会员元宝数
        http.httpPost('member_acer', { member_id: wx.getStorageSync('member_id') }, function (res) {
          that.setData({
            memberAcer: res.data.member_acer
          });
        });
        that.setData({
          showModel: false,
          show: true,
        });
      }else{
        wx.showModal({
          content: '网络错误,请稍后再试',
          showCancel: false
        })
      }
    });
  },
  close:function(){
    var that = this;
    that.getTodayReward();
    this.setData({
      showModel:true
    })
  },

  /**
   * 获取当前签到信息 - 20180112 - LQ
   */
  getTodayReward: function()
  {
    var that = this;
    http.httpPost('signpage_reward',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      if(res.data.is_sign == 1){
        var show = true;
      }else{
        var show = false;
      }
      that.setData({
        acer : res.data.acer,
        show : show,
        memberAcer : res.data.member_acer
      });
    });
  },

  /**
   * 一周签到信息 - 20180112 - LQ
   */
  weekSign: function(){
    var that = this;
    http.httpPost('signpage_week',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      that.setData({
        signNotes : res.data.week,
        continueDays: res.data.continue_days
      });
    });
  },

  /**
   * 兑换记录 - 20180112 - LQ
   */
  exchangeList: function(){
    var that = this;
    http.httpPost('signpage_history',{
      member_id: wx.getStorageSync('member_id') 
    },function(res){
      if(res.code == 200){
        that.setData({
          exchangeList: res.data.exchange_order
        });
      }else{
        that.setData({
          orderShow : false
        });
      }
    });
  }
})