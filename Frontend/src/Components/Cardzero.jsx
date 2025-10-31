import React, { useEffect, useState } from 'react';
import './regshow.css'
const API_URL = `${import.meta.env.VITE_API_URL}`;  

function Cardzero() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/countzero`)
      .then(res => res.json())
      .then(jsonData => {
        setTotal(jsonData.total);
      })
      .catch(err => {
        console.error("Error fetching total:", err);
      });
  }, []);

  return (
    <div className="card"  style={{ border: "2px solid red" }}>
      <h2>จำนวนหลักสูตรที่ยังไม่มีผู้สมัคร</h2>
      <p>{total !== null ? `${total}` : 'กำลังโหลด...'}</p>
    </div>
  );
}

// ✅ Named export
export default Cardzero;
