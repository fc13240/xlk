// pages/share/share.js
const app = getApp();
var http = require('../../utils/httpHelper.js');
var config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgs:[],
      content:"", //晒单感受
      orderNum:"", //订单号
      shareContent:"", //晒单说明
  },
  onLoad:function(e){
     this.setData({
       orderNum:e.num
     }),
     //获取晒单说明 - 20180115 - LQ
     this.getShareContent();
  },
  chooseImageTap:function(e){
    let self = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            self.chooseWxImage('album',function(result){
              self.setData({
                imgs: result
              });
            })
          } else if (res.tapIndex == 1) {
            self.chooseWxImage('camera', function (result) {
              self.setData({
                imgs : result
              });
            })
          }
        }
      }
    })
  },
  chooseWxImage: function (type,cb) {
    var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID  
    if (session_id != "" && session_id != null) {
      var header = { 'content-type': 'multipart/form-data', 'Cookie': 'PHPSESSID=' + session_id }
    } else {
      var header = { 'content-type': 'multipart/form-data' }
    } 
    let self = this;
    wx.chooseImage({
      count:9,//限制上传图片的数量，默认9张
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var images = res.tempFilePaths;
        typeof cb == "function" && cb(images);
      }
    })
  },

  //删除图片
  delImageTap : function(e){
    var that = this;
    var imgsIndex = e.currentTarget.dataset.id;
    var imgs = that.data.imgs;
    imgs.splice(imgsIndex,1);
    that.setData({
      imgs : imgs
    });
  },
  

  formSubmit :function(e){
    var that = this;
    var content = e.detail.value.content;
    var orderNum = e.detail.value.orderNum;
    if (content == '' || content == null){
      wx.showModal({
        content: '请输入晒单评价',
        showCancel : false
      })
    };

    if(orderNum == '' || orderNum == null){
      wx.showModal({
        content: '请输入订单号',
        showCancel: false
      })
    };

    //生成订单 - 20180110 - LQ

    var imageData = {
      url: config.UPLOAD_URL,
      path: that.data.imgs
    };

    //上传图片
    app.uploadimg(imageData,function(res){
      http.httpPost('shareOrder_front',{
        evaluate : content,
        order_num : orderNum,
        evaluate_url: JSON.stringify(res),
        member_id: wx.getStorageSync('member_id') 
      },function(result){
        if(result.code == 200){
          wx.showModal({
            content: result.data.message,
            showCancel : false,
            success:function(res){
              if (res.confirm) {
                wx.navigateBack({});
              }
            }
          })
        }else{
          wx.showModal({
            content: result.error,
            showCancel : false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({});
              }
            }
          })
        }
      });
    });
  },

  /**
   * 获取晒单说明 - 20180115 - LQ
   */
  getShareContent:function()
  {
    var that = this;
    http.httpPost('shareBrief',{},function(res){
      that.setData({
        shareContent: res.data.brief
      });
    });
  }

})