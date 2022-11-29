const jwt = require('jsonwebtoken')
const { expressjwt: jwtAuth } = require('express-jwt') // 验证Token

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
const transfer = (originObj) => {
  const reg = /_{1,2}\w/g // 这里正则的格式取决于自己
  if (originObj instanceof Array) {
    // 数组的处理方式
    const data = originObj.map((item) => {
      const result = {}
      const keys = Object.keys(item)
      for (let key of keys) {
        const value = item[key]
        key = key.replace(reg, (match) => match.replace(/_/g, '').toLocaleUpperCase())
        result[key] = isObject(value) ? transfer(value) : value
      }
      return result
    })
    return data
  } else {
    const result = {}
    const keys = Object.keys(originObj)
    for (let key of keys) {
      const value = originObj[key]
      key = key.replace(reg, (match) => match.replace(/_/g, '').toLocaleUpperCase())
      result[key] = isObject(value) ? transfer(value) : value
    }
    return result
  }
}
const jsonWrite = (res, result, obj) => {
  // 常用的返回方式有四种
  // res.json([status|body], [body]) 以json的形式返回数据
  // res.render(view [, locals] [, callback]) 返回对应的view和数据，此方法可以有回调函数，以处理可能出现的异常
  // res.send([body|status], [body]) 返回自定义的数据，比如json或者404等状态
  // res.redirect([status,] path) 这个方法其实不是返回，而是跳转到另外一个url上
  // 返回体的整体处理
  if (typeof result === 'undefined') {
    res.json({
      status: 404,
      message: '操作失败'
    })
  } else {
    res.json({
      status: obj ? obj.code : 200,
      message: obj ? obj.message : '请求成功',
      data: transfer(result)
    })
  }
}

// token 的校验
const secret = 'kfjsiongfd'

const createToken = (data, expire) => {
  const obj = {}
  obj.data = data || {}
  obj.cTime = new Date().getTime()
  const token = jwt.sign(obj, secret, { expiresIn: 1 * 60 * 30 }) // 过期时间是s
  return token
}

const verifyToken = (token) => {
  let result = null
  const { data, cTime, expiresIn } = jwt.verify(token, secret)
  const nowTime = new Date().getTime()
  if (nowTime - cTime < expiresIn) {
    result = data
  }
  return result
}

const jwtVerify = jwtAuth({
  // 处理token
  secret: secret,
  algorithms: ['HS256'] // 必填项
}).unless({
  path: ['/user/login'] // 除了这个地址，其他的URL都需要验证
})

module.exports = { jsonWrite, secret, jwtVerify, createToken, verifyToken }
