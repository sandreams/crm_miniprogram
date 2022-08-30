// pages/center/center.js
import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
import * as request from "../../utils/request";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShop: false,
    services: [
      { icon: "shop-o", title: "附近门店" },
      { icon: "service-o", title: "在线客服" },
    ],
    userInfo: null,
    refresh: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.canIUse("getSetting")) {
      this.setData({
        canIUseGetSettings: true,
        refresh: true,
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  init(){
    // 获取本地登录 token
    const token = wx.getStorageSync("auth_token");
    if (token) {
      this.checkIsBindShop();
    }
    this.setData({ isAuth: !!token, refresh: false });
  },
  openAuthPage() {
    this.setData({
      refresh: true,
    });
    wx.navigateTo({
      url: "../auth/auth",
    });
  },
  checkIsBindShop() {
    const that = this;
    app.getUserInfo().then((res) => {
      const isShop = res.data.shop_id;
      if (!isShop || app.globalData.debug) {
        // 未绑定店铺会弹出位置选择
        that.openLocationSetting();
      }
      that.setData({
        userInfo: res.data,
        isShop: isShop,
      });
    });
  },
  openLocationSetting() {
    const that = this;
    if (wx.canIUse("getSetting")) {
      wx.getSetting({
        withSubscriptions: false,
        success(res) {
          console.log("setting: ", res.authSetting);
          const authSetting = res.authSetting;
          // 未授权过会询问
          if (authSetting["scope.userLocation"] === undefined) {
            console.log("开始请求位置信息");
            that.bindShop();
          } else if (authSetting["scope.userLocation"] === false) {
            // 如果之前拒绝授权过会弹出提示
            Dialog.confirm({
              title: "请求授权当前位置",
              message: "需要获取您的地理位置，请确认授权",
              cancelButtonText: "暂不",
            })
              .then(() => {
                // 打开设置
                wx.openSetting({
                  withSubscriptions: false,
                });
              })
              .catch(() => {
                // 关闭授权窗口
              });
          } else {
            // 已授权
            console.log("已授权");
            Dialog.confirm({
              title: "绑定门店",
              message: "使用当前定位并绑定门店？",
              cancelButtonText: "手动选择",
            })
              .then(() => {
                // 关联门店
                that.bindShop();
              })
              .catch(() => {
                // 前往手动门店选择
                that.goToShopSelect();
              });
          }
        },
      });
    } else {
      that.bindShop();
    }
  },
  goToShop() {
    // 前往附近门店
    const app = getApp();
    this.setData({
      refresh: true,
    });
    if (app.globalData.debug) {
      wx.navigateTo({
        url: "../shop/shop",
      });
      return;
    }
    app.checkIsAuth().then(
      (success) => {
        wx.navigateTo({
          url: "../shopselect/shopselect",
        });
      },
      () => {
        this.openAuthPage();
      }
    );
  },
  goToShopSelect() {
    // 前往附近门店
    const app = getApp();
    this.setData({
      refresh: true,
    });
    if (app.globalData.debug) {
      wx.navigateTo({
        url: "../shop/shop",
      });
      return;
    }
    app.checkIsAuth().then(
      (success) => {
        wx.navigateTo({
          url: "../shopselect/shopselect",
        });
      },
      () => {
        this.openAuthPage();
      }
    );
  },
  bindShop() {
    const that = this
    wx.getLocation({
      altitude: false,
      success(res) {
        console.log("打印定位res: ", res);
        app
          .bindShopByLocation(res.latitude, res.longitude)
          .then(() => {
            // 成功绑定
            Toast.success("绑定门店成功");
            that.init();
          })
          .catch((err) => {
            Toast.fail("绑定门店失败");
          });
      },
      fail() {
        // 手动选择门店
        that.setData({
          refresh: true,
        });
        wx.navigateTo({
          url: "../shopselect/shopselect",
        });
      },
    });
  },
});
