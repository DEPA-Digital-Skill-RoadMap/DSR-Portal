import React, { useState } from "react";
import './Navbar.css';
import bar from '../assets/Hamburger_icon.svg.png';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* ปุ่มกด (รูป hamburger) */}
      <div>
        <img 
          src={bar} 
          className="img" 
          alt="bar" 
          onClick={() => setSidebarOpen(true)} 
        />
      </div>

      {/* Overlay (กดแล้วปิด sidebar ได้) */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <ul>
          <li><a href="/regshow">หน้าแรก</a></li>
          <li><a href="/Dashboard">แดชบอร์ด</a></li>
        </ul>
      </div>
    </>
  );
}
