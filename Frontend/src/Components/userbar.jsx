import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserBar() {
  const [showLogout, setShowLogout] = useState(false);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div
      className="position-absolute top-0 end-0 d-flex flex-column align-items-end p-5 fs-3"
      style={{ gap: "15px" }}
    >
      {/* Username / Guest */}
      <span
        className="border border-3 rounded-pill px-3 py-1 "
        style={{ backgroundColor: '#ffffff', cursor: 'pointer', marginRight: "50px"}}
        onClick={() => setShowLogout(prev => !prev)}
      >
        {username || "Guest"}
      </span>

      {/* ปุ่ม Logout (แสดงเมื่อคลิก username) */}
      {username && showLogout && (
        <button
          onClick={handleLogout}
          className="btn btn-outline-dark mt-2"
          style={{ backgroundColor: 'red', color: 'white', marginRight: "45px" }}
        >
          ออกจากระบบ
        </button>
      )}
    </div>
  );
}

export default UserBar;
