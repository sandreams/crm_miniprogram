// index.js
import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
Page({
  onLoad() {
    const app = getApp();
    // wx.request({
    //   url: app.globalData.baseUrl + "/wxapp/user/bindShop",
    //   method: "POST",
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     Authorization: app.getSession(),
    //   },
    //   data: {
    //     shop_id: "508f085625dce7cb30dbdd5e69f4a672",
    //   },
    //   dataType: "json",
    //   success: (data) => {
    //     console.log("data: ", data);
    //   },
    // });
  },
});
