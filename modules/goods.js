/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express')
const conn = require('../db.js')
const router = express.Router()
const { jsonWrite } = require('../util.js') // 处理返回体，同时把下划线转为驼峰

router.get('/goods/list', (req, res) => {
  const { name, type } = req.query
  let typeSql
  if (type === '') {
    // 对type类型进行精确/模糊双重匹配
    typeSql = `and type like '%%'`
  } else {
    typeSql = `and type = '${type}'`
  }
  const sql = `select * from goods where name like '%${name}%' ${typeSql};`
  conn.query(sql, (err, result) => {
    if (err) {
      throw new Error('获取失败')
    }
    if (result) {
      jsonWrite(res, result, { code: 200, message: '获取商品列表成功' })
    }
  })
})

router.post('/goods', (req, res) => {
  const { name, type } = req.body
  const sql = `INSERT INTO goods (name,type) values('${name}','${type}');`
  conn.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    jsonWrite(res, result, { code: 200, message: '新增商品成功' })
  })
})

router.put('/goods', (req, res) => {
  console.log(req)
  const { id, name, type } = req.body
  const sql = `UPDATE goods set type = '${type}',name = '${name}' WHERE id = '${id}';`
  conn.query(sql, (err, result) => {
    if (err) {
      throw new Error()
    }
    jsonWrite(res, result, { code: 200, message: '编辑商品成功' })
  })
})

router.delete('/goods', (req, res) => {
  const { id } = req.body
  const sql = `DELETE FROM goods WHERE id = '${id}';`
  conn.query(sql, (err, result) => {
    if (err) {
      throw new Error()
    }
    jsonWrite(res, result, { code: 200, message: '删除用户成功' })
  })
})

module.exports = router
