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
  login() {
    // 登录到后台并获取 token
    var that = this
    this.clearSession()
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        that.getAuthToken()
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success: res => {
            that.getAuthToken()
          }
        })
      }
    })
  },
  getAuthToken() {
    var that = this
    request.post('/wxapp/login/getWxMobile', {
      code: 'dfsdfsdfsd54654'
    }).then((data) => {
      console.log('data: ', data)
      that.setSession(data.data.token)
    })
  },
  clearSession() {
    wx.removeStorageSync('auth_token')
  },
  setSession(value) {
    wx.setStorageSync('auth_token', value)
  },
  getUserInfo() {
    return request.get('/wxapp/user/userInfo')
  },
  globalData: {
    baseUrl: 'http://192.168.63.21'
  }
})
