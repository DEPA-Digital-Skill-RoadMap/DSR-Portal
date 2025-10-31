import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // เมื่อ scroll ลงมาเกิน 300px จะแสดงปุ่ม
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // เมื่อคลิกปุ่ม จะ scroll ไปด้านบนอย่าง smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          backgroundColor: '#0B004F',
          color: '#fff',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '50%',
          fontSize: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          zIndex: 1000,
          cursor: 'pointer',
        }}
        title="กลับขึ้นบนสุด"
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTopButton;
