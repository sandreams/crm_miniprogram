// app.js
const request = require('./utils/request')
App({
  onLaunch() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code) {
          request.get('/wxapp/login/getOpenid?code=' + res.code).then((data) => {
            console.log('data', data)
            if (data.data && data.data.openid){
              wx.setStorageSync('openid', data.data.openid)
            }
          }, (err) => {
            console.log('err', err)
          })
        }
      }
    })
  },
  clearSession() {
    wx.removeStorageSync('auth_token')
  },
  setSession(value) {
    wx.setStorageSync('auth_token', value)
  },
  globalData: {
    baseUrl: 'http://192.168.63.21'
  }
})
