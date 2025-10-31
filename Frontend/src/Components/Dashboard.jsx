import Cardcountall from "./Cardcountall"
import Tablecourse from "./Tablecourse";
import Cardcountcourse from "./Cardcountcourse";
import Cardzero from "./Cardzero";
import CardDiff from "./Carddiff";
import UserBar from "./userbar";
import Navbar from "./HBGBar";
import logo from '../assets/Logo depa-03_Midnight Blue (1).png';
import ScrollToTopButton from "./totop";


function Dashboard(){
    return(
        <div className="border-radius: 15px !important; rounded-top" style={{ backgroundColor: '#ffffff' }}>
            <div className="border rounded-3" style={{ backgroundColor: '#ffffff' }}>
                <div className="fs-2 rounded-top" style={{ backgroundColor: '#fff200' }}>
                    <div 
                        className="d-flex align-items-center flex-grow-1 text-wrap" 
                        style={{ gap: '2rem', minHeight: '80px' }} // กำหนดความสูงขั้นต่ำให้ทุก element อยู่เส้นเดียวกัน
                    >
                        <Navbar />
                        <a href="/regshow" target="_self" className='fs-3 ms-3' style={{color: 'black', textDecoration: 'none'}}><img src={logo} style={{ width: "150px", height: "auto"}} alt="logo" /></a><br />
                        <div className="flex-grow-1">
                            แดชบอร์ด
                        </div>

                        <div className="ms-auto me-5 d-flex align-items-center">
                            <UserBar />
                        </div>
                    </div>
                </div>
            </div>

            
            <div>
                <div>
                    อัพเดทข้อมูลทุกๆ ตี 5 ของทุกวัน
                </div>
                <iframe 
                    title="Power BI Report" 
                    width="1475" 
                    height="600" 
                    src="https://app.powerbi.com/view?r=eyJrIjoiMjUwYmEwMjYtZTZlYS00OWRkLTk4NjUtYTBjNTJjZTZkNWI1IiwidCI6IjRhNGY3YjUyLTBlMDUtNDQxNS04NDU0LTc2ODliMDBhODdiMiIsImMiOjEwfQ%3D%3D"
                    frameborder="0" 
                    allowFullScreen="true">
                </iframe>

            </div >
        </div>
    )
}

export default Dashboard;