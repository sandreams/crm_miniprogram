const request = function (url, options = {}) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + url,
      method: options.method || "GET",
      data:
        options.method == "GET" ? options.data : JSON.stringify(options.data),
      // header 里存放auth-token
      header: {
        Authorization: wx.getStorageSync("auth_token") || "",
      },
      success(res) {
        resolve(res.data);
      },
      fail(err) {
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
