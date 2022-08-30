import Dialog from "@vant/weapp/dialog/dialog";
const request = function (url, options = {}) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + url,
      method: options.method || "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization: app.getSession(),
      },
      dataType: "json",
      data: options.data,
      // options.method == "GET" ? options.data : JSON.stringify(options.data),
      success(res) {
        if (res.data && res.data.code === 40029) {
          // 清除token
          app.clearSession();
          Dialog.confirm({
            title: "登录已过期",
            message: "是否重新登录？",
          }).then(() => {
            // 前往个人中心
            wx.switchTab({
              url: "/pages/center/center",
            });
          });
          reject(res.data);
          return;
        }
        resolve(res.data);
      },
      fail(err) {
        if (err.code === 40029) {
          // 清除token
          app.clearSession();
          Dialog.confirm({
            title: "登录已过期",
            message: "是否重新登录？",
          }).then(() => {
            // 前往个人中心
            console.log("前往个人中心");
            wx.switchTab({
              url: "/pages/center/center",
            });
          });
        }
        reject(err);
      },
    });
  });
};
export function get(url, options) {
  return request(url, {
    method: "GET",
    ...options,
  });
}
export function post(url, options) {
  return request(url, {
    method: "POST",
    ...options,
  });
}
