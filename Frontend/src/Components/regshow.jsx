import Cardcountall from "./Cardcountall"
import Tablecourse from "./Tablecourse";
import Cardcountcourse from "./Cardcountcourse";
import Cardzero from "./Cardzero";
import CardDiff from "./Carddiff";
import UserBar from "./userbar";
import Navbar from "./HBGBar";
import logo from '../assets/Logo depa-03_Midnight Blue (1).png';
import ScrollToTopButton from "./totop";


function Regshow(){
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
                            รายชื่อหลักสูตร Digital Skill Roadmap ที่รับสมัครผ่านแอป "ทางรัฐ"
                        </div>

                        <div className="ms-auto me-5 d-flex align-items-center">
                            <UserBar />
                        </div>
                    </div>
                </div>
            </div>


            
            <div className="cards-container cards-container-flex rounded-bottom shadow" >
                <CardDiff />
                <Cardzero />
                <Cardcountcourse />
                <Cardcountall />
                <ScrollToTopButton />
            </div >
                <br />
                <div style={{paddingLeft: "2rem", paddingRight: "2rem"}}>
                    <Tablecourse />
                </div>
        </div>
    )
}

export default Regshow;