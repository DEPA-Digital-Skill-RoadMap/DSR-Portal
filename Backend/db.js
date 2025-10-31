const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'your_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,    // 10 วินาที
  enableKeepAlive: true,    // เปิดใช้งาน keep-alive
  keepAliveInitialDelay: 10000  // หน่วง 10 วินาที ก่อนเริ่ม keep-alive
});

module.exports = pool;
