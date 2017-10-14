var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  API: {
    schema: '"http://"',
    base: '"huodonghezi.net"',
    // base: '"huodonghezi.com"',
    timeout: '"5000"',

    api: '"admin-api"',        // API二级域名
    // api: '"admin.api.local"',

    emma: '"emma"',            // SDK项目接口二级域名
    houtai: '"houtai"',     // 商家后台前端二级域名
    mcshop: '"api"',        // 商家后台API二级域名
  }
})
