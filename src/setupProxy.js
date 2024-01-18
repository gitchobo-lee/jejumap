const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "http://mapservice.duckdns.org",
    createProxyMiddleware({
      target: "https://api.vworld.kr/",
      changeOrigin: true,
    })
  );
};
