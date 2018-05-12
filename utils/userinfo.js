var http = require('./httpHelper.js');

function checkLogin()
{
  wx.getSetting({
    success(res) {
      console.log(res);
      if (res.authSetting['scope.userInfo'] == null) {
        login();
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
                  
                }
              })
            }
          }
        })
      }
      else if (res.authSetting['scope.userInfo']) {
        getUserInfo();
      }
    }
  })
}

function login() {
  var that = getApp();
  //调用登录接口
  wx.login({
    success: function (res) {
      if (res.code) {
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            //发起网络请求
            var userInfo = res.userInfo;
            that.globalData.userInfo = userInfo;
            http.httpPost('login',{code:res.code},function(res){
              //将session_key存档
              wx.setStorageSync('LoginSessionKey', res.session_key);
              wx.setStorageSync('member_id', res.member_id);
            });
          }
        });
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
};

function getUserInfo() {
  wx.getUserInfo({
    success: res => {
      that.globalData.userInfo = res.userInfo;
    }
  })
}

module.exports = {
  userInfo: checkLogin
};