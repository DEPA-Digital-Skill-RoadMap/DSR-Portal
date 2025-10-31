import React from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Navbar from './HBGBar';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import UserBar from './userbar';
import '../Components/MyDataTable.css';
import { useParams } from 'react-router-dom';
import logo from '../assets/Logo depa-03_Midnight Blue (1).png';
import excel from '../assets/excel.png';
const API_URL = `${import.meta.env.VITE_API_URL}`;

DataTable.use(DT);

function Tableregister() {
  const { name } = useParams();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    console.log("URL name parameter:", name);
    
    fetch(`${API_URL}/api/registrations`)  
      .then(res => res.json())
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
        console.log("Data loaded:", jsonData);
        console.log("Total records:", jsonData.length);
        
        // ตรวจสอบชื่อหลักสูตรที่มีในข้อมูล
        const courseNames = [...new Set(jsonData.map(item => item.Course))];
        console.log("Available courses:", courseNames);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Decode URL parameter เผื่อมีการ encode
  const decodedName = name ? decodeURIComponent(name) : null;
  console.log("Decoded name:", decodedName);

  const filteredData = React.useMemo(() => {
    if (!decodedName) return data;
    
    const filtered = data.filter(row => {
      const courseName = row.Course?.toString().toLowerCase().trim();
      const filterName = decodedName.toLowerCase().trim();
      
      console.log(`Comparing: "${courseName}" === "${filterName}"`);
      return courseName === filterName;
    });
    
    console.log("Filtered data count:", filtered.length);
    return filtered;
  }, [data, decodedName]);

  const columns = [
    { title: 'รหัสผู้สมัคร', data: 'RegID' },
    { title: 'ชื่อ', data: 'Name' },
    { title: 'นามสกุล', data: 'Surname' },   
    { title: 'เพศ', data: 'Sex' },
    { title: 'อายุ', data: 'Age' },
    { title: 'เบอร์โทรติดต่อ', data: 'Numphone' },
    { title: 'อีเมล', data: 'Email' },
    { title: 'รหัสบัตรประชาชน', data: 'IDcard' },
    { title: 'จังหวัด', data: 'Province' },
    { title: 'ลิงก์บัตรประชาชน', data: 'IDcardLink',
      render: function(data, type, row, meta) {
          return `
            <a href="${data}" 
              class="btn btn-link" 
              style="padding:6px 12px; color:blue; text-decoration:none; border:5px;" 
              target="_blank" 
              rel="noopener noreferrer">
              ลิงก์บัตรประชาชน
            </a>`;
        }},

    { title: 'ลิงก์เอกสารเพิ่มเติม', data: 'OtherLink' },
    { title: 'กลุ่ม', data: 'GroupName' },
    { title: 'กลุ่มย่อย', data: 'Semigroup' },
    { title: 'ระดับหลักสูตร', data: 'Levelcourse' },
    { title: 'กลุ่มหลักสูตร', data: 'Coursegroup' },
  ];

    

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="border-radius: 15px !important; rounded-top " style={{ backgroundColor: '#ffffff' }}>
      <div 
        className="fs-5 rounded-top d-flex align-items-center" 
        style={{ backgroundColor: '#fff200' }}
      >
        <Navbar />
        <UserBar />
        <a 
          href="/regshow" 
          target="_self" 
          className="fs-3 ms-5" 
          style={{ color: 'black', textDecoration: 'none' }}
        >
          <img 
            src={logo} 
            style={{ width: "150px", height: "auto" }} 
            alt="logo" 
          />
        </a>
    </div>

      {filteredData.length === 0 && decodedName && (
          <div className='fs-1' style={{ color: 'red', margin: '10px 0', textAlign: "center" }}> ยังไม่มีผู้สมัครในหลักสูตรนี้</div>
      )}
      <div className='shadow rounded-bottom'>
        <div 
          className='d-flex align-items-center justify-content-between' 
          style={{ width: '100%', padding: '10px 20px' }}
        >
          <div className='text-center cardreg mx-auto' style={{ border: '2px solid lightgreen' }}>
            จำนวนผู้สมัครหลักสูตรนี้  
            <p>{filteredData.length}</p>
          </div>
          <a 
            href={`${API_URL}/api/export-excel/${decodedName}`}
            className='me-3 rounded border excel'>
            <img src={excel} alt="Export" style={{ width: '100px', height: '100px' }} />
          </a>
        </div>
      </div>
      <div className=''>
      <div className='fs-4 mt-5 fw-bold'>รายชื่อผู้สมัครหลักสูตร"{decodedName}"</div>
        <div >
        <DataTable
          data={filteredData}
          columns={columns}
          className="display"
          options={{
            dom: 'Blfrtip',
            responsive: true,
            select: true,
            pageLength: 25,
            language: {
              search: "ค้นหา:",
              lengthMenu: "แสดง _MENU_ รายการ",
              info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
              paginate: {
                first: "หน้าแรก",
                last: "หน้าสุดท้าย",
                next: "ถัดไป",
                previous: "ก่อนหน้า",
                scrollX: true
              },
              emptyTable: "ไม่มีผู้สมัครในหลักสูตรนี้"
            
            }
          }}
        />
        </div>
      </div>
    </div>
  );
}

export default Tableregister;