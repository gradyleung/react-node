/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express')
const bcrypt = require('bcrypt')
const conn = require('../db.js')
const { jsonWrite, createToken } = require('../util.js') // 处理返回体，同时把下划线转为驼峰
const router = express.Router()

router.post('/user/login', (req, res) => {
  const { username, password } = req.body
  const sql = `SELECT * FROM user WHERE username='${username}'`
  conn.query(sql, (err, result) => {
    if (err) {
      throw new Error('获取失败')
    } else if (result.length < 1) {
      jsonWrite(res, result, { code: 422, message: '用户名或密码错误' })
    } else {
      const sqlPassword = result[0].password
      bcrypt.compare(password, sqlPassword, (err, response) => {
        // 原始密码，加密后密码，callback:true代表通过
        if (err) {
          throw err
        }
        if (response) {
          const token = createToken() // 创建token
          result[0].token = token
          const data = Object.assign(result[0], { token: token })
          jsonWrite(res, data, { code: 200, message: '验证通过' })
        } else {
          jsonWrite(res, result, { code: 422, message: '用户名或密码错误' })
        }
      })
    }
  })
})

router.post('/user/register', (req, res) => {
  const token = req.Bear_Token
  const { username, password } = req.body
  const hashPwd = bcrypt.hashSync(password, 10) // 生成密文密码
  const querySql = `SELECT * FROM user where username = '${username}'`
  jsonWrite(res, {}, { code: 400, message: '用户已经存在' })
  conn.query(querySql, (err, result) => {
    if (err) {
      throw err
    }
    if (result.length === 0) {
      const sql = `INSERT INTO user (username,password) values('${username}','${hashPwd}');`
      conn.query(sql, (err, result) => {
        if (err) {
          throw err
        }
        jsonWrite(res, result, { code: 200, message: '注册用户成功' })
      })
    } else {
      jsonWrite(res, result, { code: 400, message: '用户已经存在' })
    }
  })
})
router.post('/user/list', (req, res) => {
  const { firstName, lastName, age, address } = req.body
  let ageSql
  if (age === '') {
    // 对age类型进行精确/模糊双重匹配
    ageSql = ``
  } else {
    ageSql = `and age = '${age}'`
  }
  const sql = `select * from user where first_name like '%${firstName}%' and last_name like '%${lastName}%' and address like '%${address}%' ${ageSql};`
  conn.query(sql, (err, result) => {
    if (err) {
      throw new Error('获取失败')
    }
    if (result) {
      jsonWrite(res, result, { code: 200, message: '获取用户列表成功' })
    }
  })
})
router.post('/user/create', (req, res) => {
  const { firstName, lastName, age, address } = req.body
  const sql = `INSERT INTO user (first_name,last_name,age,address) values('${firstName}','${lastName}','${age}','${address}');`
  conn.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    jsonWrite(res, result, { code: 200, message: '新增用户成功' })
  })
})

router.post('/user/edit', (req, res) => {
  const { id, firstName, lastName, age, address } = req.body
  const sql = `UPDATE user set first_name = '${firstName}',last_name = '${lastName}',age = '${age}',address = '${address}' WHERE id = '${id}';`
  conn.query(sql, (err, result) => {
    if (err) {
      throw new Error()
    }
    jsonWrite(res, result, { code: 200, message: '编辑用户成功' })
  })
})
router.get('/user/remove', (req, res) => {
  const { id } = req.query
  const sql = `DELETE FROM user WHERE id = '${id}';`
  conn.query(sql, (err, result) => {
    if (err) {
      throw new Error()
    }
    jsonWrite(res, result, { code: 200, message: '删除用户成功' })
  })
})

module.exports = router
