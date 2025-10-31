import React from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import DTSelect from 'datatables.net-select-dt';
import Navbar from './HBGBar';
import 'datatables.net-responsive-dt';
import '../../node_modules/datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-select-dt/css/select.dataTables.css';
import logo from '../assets/excel.png';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const API_URL = `${import.meta.env.VITE_API_URL}`;

DataTable.use(DT);
DataTable.use(DTSelect);

function Tablecourse() {
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const [tableInstance, setTableInstance] = React.useState(null);
  const [data, setData] = React.useState([]);
  const username = localStorage.getItem("username");
  

  React.useEffect(() => {
    fetch(`${API_URL}/api/course`)
      .then(res => res.json())
      .then(jsonData => {
        setData(jsonData);
      })
      .catch(err => console.error(err));
  }, []);

  // columns ปรับให้ใช้ property ตาม API
  const columns = [
    {
      title: '<input type="checkbox" id="select-all" />',
      data: null,
      orderable: false,
      className: 'text-center',
      width: '50px',
      render: function(data, type, row, meta) {
        const isChecked = selectedRows.has(meta.row);
        return `<input type="checkbox" class="row-checkbox" data-row="${meta.row}" ${isChecked ? 'checked' : ''} />`;
      }
    },
    {
      title: 'หลักสูตร',
      data: 'CourseName',
      render: function(data, type, row, meta) {
        return `<a href="/regshow/${encodeURIComponent(data)}" class="btn-link" style="padding:6px 12px; color:black; border-radius:5px; text-decoration:none;">${data}</a>`;
      }
    },
    { title: 'จำนวนผู้สมัคร', data: 'total' },
    { title: 'บริษัท', data: 'Company' },
    { title: 'กลุ่มคน', data: 'Group' },
    { title: 'ระดับ', data: 'Level' },
    {
    title: 'โหลดเป็นExcel',
    orderable: false,
    className: 'text-center',
    render: function(data, type, row, meta) {
      const username = encodeURIComponent(localStorage.getItem('username') || 'unknown');
      const courseName = encodeURIComponent(row.CourseName);
      return `
        <a href="${API_URL}/api/export-excel/${courseName}?username=${username}" 
          style="border:none; background:transparent; cursor:pointer;"
          target="_blank">
          <img src="${logo}" alt="Export" style="width:50px; height:50px;" />
        </a>
      `;
    }
    }
  ];

  const columnDefs = [
    {
      targets: [0, columns.length - 1], // checkbox และ export button ไม่ต้องเรียงลำดับ
      orderable: false
    }
  ];

  // Event handler สำหรับ checkbox, select all, export (เหมือนโค้ดเดิม)

  React.useEffect(() => {
    function handleClick(e) {
      if (e.target.classList.contains('row-checkbox')) {
        const rowIndex = parseInt(e.target.getAttribute('data-row'));
        handleCheckboxChange(rowIndex);
      }

      if (e.target.id === 'select-all') {
        handleSelectAll(e.target.checked);
      }

      const button = e.target.closest('.export-btn');
      if (button) {
        e.preventDefault();
        e.stopPropagation();
        const rowIndex = parseInt(button.getAttribute('data-row'));
        const rowData = data[rowIndex];
        exportRowToExcel(rowData);
      }
    }
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [selectedRows, data]);

  // ฟังก์ชันจัดการ checkbox และ select all
  const handleCheckboxChange = (rowIndex) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allRows = new Set(data.map((_, idx) => idx));
      setSelectedRows(allRows);
    } else {
      setSelectedRows(new Set());
    }
  };

  // เก็บ ref table instance เพื่อใช้ filter หรืออย่างอื่น
  const tableRef = React.useRef();

  React.useEffect(() => {
    if (tableRef.current) {
      const dt = tableRef.current.dt();
      setTableInstance(dt);
    }
  }, []);

 const handleMultiDownload = async () => {
  const selectedCourses = Array.from(selectedRows).map(idx => data[idx].CourseName);

  try {
    const response = await fetch(`${API_URL}/api/export-multi-excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        courseNames: selectedCourses,
        username: localStorage.getItem('username') || 'unknown' // ส่ง username ไปด้วย
      })
    });

    if (!response.ok) {
      throw new Error('Download failed'); 
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'รายชื่อผู้สมัคร.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading ZIP:', error);
  }
};



  // Sync checkbox กับ selectedRows
  React.useEffect(() => {
    document.querySelectorAll('.row-checkbox').forEach(checkbox => {
      const rowIndex = parseInt(checkbox.getAttribute('data-row'));
      checkbox.checked = selectedRows.has(rowIndex);
    });

    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = selectedRows.size === data.length;
      selectAllCheckbox.indeterminate = selectedRows.size > 0 && selectedRows.size < data.length;
    }
  }, [selectedRows, data.length]);

    return (
      <div>
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <strong>เลือกแล้ว: {selectedRows.size} แถว</strong>
          <button
            onClick={() => {
              if (!tableInstance) return;
              const filteredData = tableInstance.rows({ search: 'applied' }).data().toArray();
              const filteredIndices = new Set();
              filteredData.forEach(rowData => {
                const idx = data.findIndex(d => d.idCourse === rowData.idCourse);
                if (idx !== -1) filteredIndices.add(idx);
              });
              setSelectedRows(filteredIndices);
            }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            เลือกทั้งหมดที่กรอง
          </button>

          {selectedRows.size > 0 && (
            <button
              onClick={() => setSelectedRows(new Set())}
              style={{
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              ยกเลิกเลือกทั้งหมด
            </button>
          )}
            {selectedRows.size > 0 && (
        <button 
          onClick={handleMultiDownload}
          style={{
            padding: '5px 10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          ดาวน์โหลดหลายไฟล์
        </button>
      )}

        </div>
      <DataTable
      ref={tableRef}
      data={data}
      columns={columns}
      columnDefs={columnDefs}
      className="display"
      responsive={true}
      order={[[1, 'asc']]}
      options={{
        dom: 'Blfrtip',
        processing: true,
        serverSide: false,
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        scrollX: true
      }}
    />
    </div>
  );
}


export default Tablecourse;
