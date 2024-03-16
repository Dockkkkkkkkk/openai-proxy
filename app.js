const express = require('express')
const {
  createProxyMiddleware
} = require('http-proxy-middleware');
const app = express()
const port = 9000

app.use('/', createProxyMiddleware({
  target: 'https://api.openai.com',
  changeOrigin: true,
  onProxyReq: function (proxyReq, req, res) {
    // 获取所有请求头的键（即头名称）
    const headers = Object.keys(proxyReq.getHeaders());
    // 遍历所有请求头
    headers.forEach(header => {
      // 检查请求头的键名是否以'x-fc'开头
      if (header.startsWith('x-fc')) {
        // 移除以'x-fc'开头的请求头(x-fc开头请求头是云函数给加上的，OpenAI接口对请求头size做了限制，不删的话会报错)
        proxyReq.removeHeader(header);
      }
    });
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

app.listen(port, (req) => {
  console.log(`Example app listening at http://localhost:${port}`)
})
