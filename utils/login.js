var http = require('httpHelper.js');
function dologin(cb) {
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo'] == null) {
        login(cb);
      }
      else if (!res.authSetting['scope.userInfo']) {
        wx.showModal({
          title: '',
          content: '需要开启用户信息才能使用此权限',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  login(cb);
                }
              })
            }
          }
        })
      }
      else if (res.authSetting['scope.userInfo']) {
        login(cb);
      }
    }
  })
};

function login (cb) {
  var that = this;
  //调用登录接口
  wx.login({
    success: function (result) {
      if (result.code) {
        var code = result.code;
        wx.getUserInfo({
          success: function (res) {
            //发起网络请求
            var userInfo = res.userInfo;
            http.httpPost('login', { code: code, user_info: res.rawData, encryptedData: res.encryptedData, iv: res.iv}, function (res) {
              //将session_key存档
              wx.setStorageSync('LoginSessionKey', res.session_key);
              wx.setStorageSync('member_id', res.member_id);
              typeof cb == "function" && cb(userInfo);
            });
          },
          fail: function () {
            wx.navigateBack({});
          }
        });
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    },
  });
};

module.exports = {
  dologin: dologin
};