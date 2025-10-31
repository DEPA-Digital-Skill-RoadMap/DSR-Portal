import { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo depa-03_Midnight Blue (1).png';
const API_URL = `${import.meta.env.VITE_API_URL}`;


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/regshow');
      localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    } catch (err) {
      alert('เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleKeyDown = (e) => {
    const isCaps = e.getModifierState && e.getModifierState('CapsLock');
    setIsCapsLockOn(isCaps);
  };



  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#0B004F' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        className="position-absolute top-50 start-50 translate-middle w-100 d-flex flex-column align-items-center p-3 mb-2 text-white rounded"
        style={{ maxWidth: '400px', backgroundColor: '#fff200' }}
      >
        <img src={logo} className="w-50" alt="logo" />
        <div className='mb-3 fs-3 text-center fw-bolder' style={{ color: '#0C2F53' }}>
          ฐานข้อมูลผู้สมัครโครงการ Digital Skill Roadmap
        </div>

        <p className="w-100 text-start" style={{ color: '#0B004F' }}>Email</p>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="อีเมล"
          className="form-control mb-3"
        />

        <p className="w-100 text-start" style={{ color: '#0B004F' }}>Password  
        {isCapsLockOn && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          ⚠️ Caps Lock เปิดอยู่
        </div>
        )}</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="รหัสผ่าน"
          className="form-control mb-4"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyDown}
        />
         
        <button type="submit" className="btn  w-100 button button-hover" style={{ background: '#0B004F', color: 'white'}} >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>


  );
}

export default LoginPage;
