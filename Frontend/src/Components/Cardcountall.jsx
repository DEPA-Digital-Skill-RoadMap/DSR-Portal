import React, { useEffect, useState } from 'react';
const API_URL = `${import.meta.env.VITE_API_URL}`;

function Cardcountall() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/countall`)
      .then(res => res.json())
      .then(jsonData => {
        setTotal(jsonData.total);
      })
      .catch(err => {
        console.error("Error fetching total:", err);
      });
  }, []);

  return (
    <div className="card" style={{ border: "2px solid yellow" }}>
      <h2>จำนวนผู้สมัครทั้งหมด</h2>
      <p>{total !== null ? `${total}` : 'กำลังโหลด...'}</p>
    </div>
  );
}

// ✅ Named export
export default Cardcountall;
