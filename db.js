/* eslint-disable @typescript-eslint/no-require-imports */

const mysql = require('mysql')
const db = {
  connectionLimit: 10,
  host: '120.24.97.46',
  post: '3306',
  user: 'root',
  password: 'abcd1234',
  database: 'reactApp'
}
const conn = mysql.createConnection(db)
conn.connect((err) => {
  // 连接数据库
  if (err) throw new Error('fail to connect mysql')
  console.log('线程id:' + conn.threadId)
})
module.exports = conn
