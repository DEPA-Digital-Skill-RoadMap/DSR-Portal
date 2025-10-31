import React, { useState, useEffect } from 'react';

function CardDiff() {
  const [totalCourse, setTotalCourse] = useState(null);
  const [totalZero, setTotalZero] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    // ดึงจำนวนหลักสูตรทั้งหมด
    fetch(`${API_URL}/api/countcourse-total`)
      .then(res => res.json())
      .then(data => setTotalCourse(data.total))
      .catch(err => setError(err));

    // ดึงจำนวนหลักสูตรที่ไม่มีผู้สมัคร
    fetch(`${API_URL}/api/countzero`)
      .then(res => res.json())
      .then(data => setTotalZero(data.total))
      .catch(err => setError(err));
  }, []);

  if (error) return <div>เกิดข้อผิดพลาด: {error.message}</div>;
  if (totalCourse === null || totalZero === null) return <div>กำลังโหลด...</div>;

  const diff = totalCourse - totalZero;

  return (
    <div className="card"  style={{ border: "2px solid lightgreen" }}>
      <h2>จำนวนหลักสูตรที่มีผู้สมัคร</h2>
      <p>{diff}</p>
    </div>
  );
}

export default CardDiff;
