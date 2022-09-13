// app.js
import regeneratorRuntime from "regenerator-runtime";
import * as request from "./utils/request";
App({
  onLaunch() {
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          request.get("/wxapp/login/getOpenid?code=" + res.code).then(
            (data) => {
              console.log("getOpenid 的结果：", data);
              if (data.data && data.data.openid) {
                wx.setStorageSync("openid", data.data.openid);
                wx.setStorageSync("session_key", data.data.session_key);
              }
            },
            (err) => {
              console.log("getOpenid 错误：", err);
            }
          );
        }
      },
    });
  },
  login() {
    // 登录到后台并获取 token
    const that = this;
    return new Promise((resolve, reject) => {
      try {
        this.clearSession();
        wx.checkSession({
          success() {
            //session_key 未过期，并且在本生命周期一直有效
            that
              .getAuthToken()
              .then((data) => {
                console.log("登录结果 data: ", data);
                that.setSession(data.data.token);
                resolve();
              })
              .catch((err) => {
                console.log("登录结果 err: ", err);
                reject();
              });
          },
          fail() {
            // session_key 已经失效，需要重新执行登录流程
            wx.login({
              success() {
                that
                  .getAuthToken()
                  .then((data) => {
                    console.log("登录结果 data: ", data);
                    that.setSession(data.data.token);
                    resolve();
                  })
                  .catch(() => {
                    reject();
                  });
              },
              fail() {
                reject();
              },
            });
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getAuthToken() {
    if (getApp().globalData.debug) {
      return Promise.resolve({
        data: {
          token: "111111",
        },
      });
    }
    const phone_code = JSON.parse(wx.getStorageSync("phone_code"));
    wx.removeStorageSync("phone_code");
    return request.post("/wxapp/login/getWxMobile", {
      data: {
        // code: phone_code,
        encryptedData: phone_code.encryptedData,
        iv: phone_code.iv,
        openid: wx.getStorageSync("openid"),
        session_key: wx.getStorageSync("session_key"),
      },
    });
  },
  clearSession() {
    wx.removeStorageSync("auth_token");
  },
  setSession(value) {
    wx.setStorageSync("auth_token", value);
  },
  getSession() {
    return wx.getStorageSync("auth_token");
  },
  getUserInfo() {
    if (getApp().globalData.debug) {
      return Promise.resolve({
        code: 12345,
        data: {
          member_id: 1,
          shop_id: 231,
        },
      });
    }
    return request.get("/wxapp/user/userInfo");
  },
  checkIsAuth() {
    // 检查是否有token，否则跳转到授权页
    return new Promise((resolve, reject) => {
      try {
        wx.getStorage({
          key: "auth_token",
          encrypt: false,
          success(res) {
            if (res.data) {
              resolve(res.data);
            } else {
              reject();
            }
          },
          fail(err) {
            reject(err);
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  bindShopByLocation(lat, lng) {
    return new Promise((resolve, reject) => {
      request
        .post("/wxapp/user/getShopList", {
          lat: lat,
          lng: lng,
        })
        .then((shopRes) => {
          if (shopRes.data.shops && shopRes.data.shops.length) {
            request
              .post("/wxapp/user/bindShop", {
                data: {
                  shop_id: shopRes.data.shops[0].shop_id,
                },
              })
              .then((data) => {
                console.log("data: ", data);
                resolve();
              })
              .catch(() => {
                reject("绑定店铺失败");
              });
          } else {
            reject("未找到店铺");
          }
        })
        .catch(() => {
          reject();
        });
    });
  },
  bindShopBySelectedShop(shop_id) {
    return request
      .post("/wxapp/user/bindShop", {
        data: {
          shop_id: shop_id,
        },
      })
  },
  globalData: {
    baseUrl: "http://192.168.63.70",
    debug: false,
  },
});
