const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const archiver = require('archiver');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

async function logLogin({ username, status, ip, userAgent }) {
  await pool.query(
    'INSERT INTO login_logs (username, status, ip_address, user_agent) VALUES (?, ?, ?, ?)',
    [username, status, ip, userAgent]
  );
}


// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  if (rows.length === 0) {
    await logLogin({ username, status: 'fail', ip, userAgent });
    return res.status(401).json({ message: 'ไม่พบผู้ใช้' });
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    await logLogin({ username, status: 'fail', ip, userAgent });
    return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
  }

  await logLogin({ username, status: 'success', ip, userAgent });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token, username: user.username });
});


// Protected route example
app.get('/profile', verifyToken, async (req, res) => {
  res.json({ message: 'เข้าสู่โปรไฟล์ของคุณ', user: req.user });
});

function verifyToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const now = new Date();
const timestamp = now.toISOString().slice(0, 10); // '2025-07-04'
const [year, month, day] = timestamp.split('-');
const formattedTimestamp = `${day}-${month}-${year}`; // '04-07-2025'


const pool = require('./db'); // 🔄 ใช้ Promise Pool

// GET: รายวิชา + จำนวนนับผู้สมัคร
app.get('/api/course', async (req, res) => {
  try {
    const query = `
      SELECT c.*, COUNT(r.ResID) AS total 
      FROM Course c 
      LEFT JOIN registrations r ON c.CourseName = r.Course 
      GROUP BY c.idCourse, c.CourseName, c.Company, c.Group 
      ORDER BY c.idCourse`;

    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: รายชื่อผู้สมัครทั้งหมด
app.get('/api/registrations', async (req, res) => {
  try {
    const query = "SELECT * FROM registrations";
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: จำนวนผู้สมัครทั้งหมด
app.get('/api/countall', async (req, res) => {
  try {
    const query = "SELECT COUNT(*) AS total FROM registrations";
    const [results] = await pool.query(query);
    res.json({ total: results[0].total });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: จำนวนคอร์สทั้งหมด
app.get('/api/countcourse-total', async (req, res) => {
  try {
    const query = "SELECT COUNT(*) AS total FROM Course";
    const [results] = await pool.query(query);
    res.json({ total: results[0].total });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: นับผู้สมัครในแต่ละคอร์ส
app.get('/api/countcourse', async (req, res) => {
  try {
    const query = "SELECT c.idCourse, c.CourseName, COUNT(r.ResID) AS total FROM Course c LEFT JOIN registrations r ON c.CourseName = r.Course GROUP BY c.CourseName ORDER BY c.idCourse";
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: จำนวนคอร์สที่ไม่มีผู้สมัคร
app.get('/api/countzero', async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS total 
      FROM Course c 
      LEFT JOIN registrations r ON c.CourseName = r.Course 
      WHERE r.ResID IS NULL`;
    
    const [results] = await pool.query(query);
    res.json(results[0]);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// GET: รายชื่อผู้สมัครตามคอร์ส
app.get('/api/registrations/:courseName', async (req, res) => {
  try {
    const courseName = decodeURIComponent(req.params.courseName);
    const query = 'SELECT RegID, Name, Email, Phone FROM registrations WHERE Course = ?';
    const [results] = await pool.query(query, [courseName]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function logDownload({ username, courseName, ip, userAgent }) {
  await pool.query(
    'INSERT INTO download_logs (username, course_name, ip_address, user_agent) VALUES (?, ?, ?, ?)',
    [username, courseName, ip, userAgent]
  );
}


// GET: ส่ง Excel รายชื่อผู้สมัคร
app.get('/api/export-excel/:courseName', async (req, res) => {
  try {
    const courseName = decodeURIComponent(req.params.courseName);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const username = req.query.username || 'unknown';

    // log download
    await logDownload({ username, courseName, ip, userAgent });

    const query = `SELECT * FROM registrations WHERE Course = ?`;
    const [results] = await pool.query(query, [courseName]);

    const workbook = new ExcelJS.Workbook();  
    const worksheet = workbook.addWorksheet('รายชื่อผู้สมัคร');

    worksheet.columns = [
      { header: 'รหัสผู้สมัคร', key: 'RegID', width: 25 },
      { header: 'ชื่อ', key: 'Name', width: 25 },
      { header: 'นามสกุล', key: 'Surname', width: 25 },
      { header: 'เพศ', key: 'Sex', width: 25 },
      { header: 'อายุ', key: 'Age', width: 25 },
      { header: 'เบอร์โทรติดต่อ', key: 'Numphone', width: 25 },
      { header: 'รหัสบัตรประชาชน', key: 'IDcard', width: 25 },
      { header: 'อีเมล', key: 'Email', width: 25 },
      { header: 'จังหวัด', key: 'Province', width: 25 },
      { header: 'ลิงก์บัตรประชาชน', key: 'IDcardLink', width: 25 },
      { header: 'ลิงก์เอกสารเพิ่มเติม', key: 'OtherLink', width: 25 },
      { header: 'กลุ่ม', key: 'GroupName', width: 25 },
      { header: 'กลุ่มย่อย', key: 'Semigroup', width: 25 },
      { header: 'ระดับหลักสูตร', key: 'Levelcourse', width: 25 },
      { header: 'กลุ่มหลักสูตร', key: 'Coursegroup', width: 25 },
      { header: 'หลักสูตร', key: 'Course', width: 25 },
    ];

    results.forEach(row => worksheet.addRow(row));

    const filename = `L.${courseName.substring(0, 30)}_${formattedTimestamp}.xlsx`;
    const encodedFilename = encodeURIComponent(filename);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodedFilename}`
    );
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting Excel:', err);
    res.status(500).send('Database error');
  }
});

const fs = require('fs');


//ดาวโหลดหลาย excel
app.post('/api/export-multi-excel', async (req, res) => {
  try {
    const courseNames = req.body.courseNames;

    if (!Array.isArray(courseNames) || courseNames.length === 0) {
      return res.status(400).json({ error: 'No courses provided' });
    }

    const filename = `รายชื่อผู้สมัคร_${timestamp}.zip`;
    const encodedFilename = encodeURIComponent(filename);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    for (const courseName of courseNames) {
      const decodedCourseName = decodeURIComponent(courseName);
      const query = `SELECT * FROM registrations WHERE Course = ?`;
      const [results] = await pool.query(query, [courseName]);

      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const username = req.body.username || 'unknown';
      await logDownload({ username, courseName: decodedCourseName, ip, userAgent });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('รายชื่อผู้สมัคร');

      worksheet.columns = [
        { header: 'รหัสผู้สมัคร', key: 'RegID', width: 25 },
        { header: 'ชื่อ', key: 'Name', width: 25 },
        { header: 'นามสกุล', key: 'Surname', width: 25 },
        { header: 'เพศ', key: 'Sex', width: 25 },
        { header: 'อายุ', key: 'Age', width: 25 },
        { header: 'เบอร์โทรติดต่อ', key: 'Numphone', width: 25 },
        { header: 'อีเมล', key: 'Email', width: 25 },
        { header: 'รหัสบัตรประชาชน', key: 'IDcard', width: 25 },
        { header: 'จังหวัด', key: 'Province', width: 25 },
        { header: 'ลิงก์บัตรประชาชน', key: 'IDcardLink', width: 25 },
        { header: 'ลิงก์เอกสารเพิ่มเติม', key: 'OtherLink', width: 25 },
        { header: 'กลุ่ม', key: 'GroupName', width: 25 },
        { header: 'กลุ่มย่อย', key: 'Semigroup', width: 25 },
        { header: 'ระดับหลักสูตร', key: 'Levelcourse', width: 25 },
        { header: 'กลุ่มหลักสูตร', key: 'Coursegroup', width: 25 },
        { header: 'หลักสูตร', key: 'Course', width: 25 },
      ];

      results.forEach(row => worksheet.addRow(row));

      const buffer = await workbook.xlsx.writeBuffer();
      archive.append(buffer, { name: `L.${courseName.substring(0, 30)}_${formattedTimestamp}.xlsx` });
    }

    await archive.finalize();
  } catch (err) {
    console.error('Error exporting multi Excel:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/log-singleexcel', async(req, res)=> {
  pool.query(
    'INSERT INTO `Dowload_Log` SET `idDowload_Log`= ?, `User`= ?, `file`= ?, `timestamp`= ?'
  )
})

app.listen(port, () => {
  console.log(`server running : ${port}`);
});