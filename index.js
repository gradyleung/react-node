/* eslint-disable @typescript-eslint/no-require-imports */
const bodyParser = require('body-parser')
const express = require('express')
const user = require('./modules/user.js')
const goods = require('./modules/goods.js')
const { jwtVerify } = require('./util') // 验证token有效
// const cors = require('cors')

const app = express()
// app.use(jwtVerify)
// app.use(cors()) 最简单的引入插件解决跨域方法
// app.use(
//   jwt({
//     secret: secret,
//     algorithms: ['HS256']
//   }).unless({
//     path: ['/user/login'] // 除了这个地址，其他的URL都需要验证
//   })
// )
// app.use((req, res, next) => {
//   // 任何路由信息都会执行这里面的语句
//   console.log('this is a api request!')
//   // 把它交给下一个中间件，注意中间件的注册顺序是按序执行
//   next()
// })
app.use(bodyParser.urlencoded({ extended: true })) // 自动解析urlencoded类型请求体
app.use(bodyParser.json()) // 解析json
app.all('*', function (req, res, next) {
  // 设置cors跨域 这段话必须在use router语句的前面
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    // 'Content-Type': 'text/plain;charset=utf-8',
    // 'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Methods': '*'
  })
  if (req.method === 'OPTIONS') {
    res.sendStatus(200) // 让options尝试请求快速结束
  } else {
    next()
  }
})
// 引入封装的路由
app.use(user)
app.use(goods)
// 跨域中间件
app.listen(8081, () => {})

console.log('正在监听8081端口')
