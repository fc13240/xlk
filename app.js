//app.js
var http = require('./utils/httpHelper.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('PHPSESSID',null);
    //wx.setStorageSync('member_id', null);
    wx.setEnableDebug({
      enableDebug: false
    })
  },

  globalFunction: function(){
    wx.checkSession({
      success:function(){
        
      }
    })
  },

  //上传图片 - 20180110 - LQ
  uploadimg: function (data,cb) {
    
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'images',
      // formData: {
      //   id: data.id
      // },
      success: function (res) {
        success++;
        var image = {
          image_url : res.data
        };
        that.globalData.imagesList.push(image);
      },
      fail: function (res) {
        fail++;
        console.log(res);
      },
      complete: function (res) {
        i++;
        if (i == data.path.length) {  //当图片传完时，停止调用   
          var imagesList = that.globalData.imagesList;
          typeof cb == "function" && cb(imagesList);
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data,cb);
        }

      }
    })
  },  

  globalData: {
    userInfo: null,
    member_id : null,
    imagesList : []
  }
})