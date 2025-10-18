import HomeImg from '../../../assets/home.svg'
import MenuImg from '../../../assets/logout.svg';
import SettingImg from '../../../assets/settings.svg';

import CalenderImg from '../../../assets/calendar.svg'

import AnalyticsImg from '../../../assets/Analytics.svg';
import RobotImg from '../../../assets/Robot_2.svg';
import { useDispatch, useSelector } from 'react-redux';
import { updatesidebarStatus } from '../../slices/sharedSlice';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// Define the shape of your Redux state
interface RootState {
    shared: {
        sidebarStatus: {
            activePage: string;
            isOpen: boolean;
        };
    };
}
interface AuthStatus {
    authenticated: boolean;
    user:string
    userData?: {
        picture?: string; // Google profile image URL
        name?: string;
    };
}

interface RootState {
    auth: { authStatus: AuthStatus };
}

interface PageListProps {
    userType?: 'teacher' | 'student';
}

const PageList = ({ userType = 'teacher' }: PageListProps) => {
    const dispatch = useDispatch();
    const activePage = useSelector((state: RootState) => state.shared.sidebarStatus.activePage);
    const isOpen = useSelector((state: RootState) => state.shared.sidebarStatus.isOpen);
    const navigate = useNavigate();

    const location = useLocation();
        const isTeacherRoute = location.pathname.includes('/teacher');

    const handleLogoClick = () => {
        console.log("to home")
        navigate("/")
    }

    const handleItemSelection = (itemName: string) => {
        const selectedItem = pageList.find(item => item.item_name === itemName);
        if (selectedItem) {
            navigate(selectedItem.navigate);
        }
        dispatch(updatesidebarStatus({ activePage: itemName }));
    };

    const pageList = [
        { item_name: 'Home', item_img: HomeImg, navigate: `/${userType}` },

        { item_name: 'Analysis', item_img: AnalyticsImg, navigate: `/${userType === 'student' ? 'student' : 'teacher'}Analysis` },

        { item_name: 'Chatbox', item_img: RobotImg, navigate: `/aichat${userType === 'student' ? 'Student' : ''}` },
        ...(userType === 'student'
            ? [{ item_name: 'Attendance', item_img: CalenderImg, navigate: "/student/attendance" }]
            : []),
        
    ];


    return (
        <div className="w-75 p-2 flex flex-col justify-end h-[89vh] overflow-y-hidden " style={{ width: isOpen ? '300px' : '80px', transition: 'width 0.1s'}}>
            <div className="flex-grow  " >
                {pageList.map((item) => (
                    <div
                        key={item.item_name}
                        onClick={() => item.item_name && handleItemSelection(item.item_name)}
                        className={`
                            flex items-center gap-4 p-4 rounded-[70px] cursor-pointer mb-2
                            transition-colors duration-200 ease-in-out
                            ${activePage === item.item_name
                                ? 'bg-blue-500 text-blue-50 font-bold shadow-inner'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-gray-700'
                            }
                        `}
                    >
                        <img
                            src={item.item_img}
                            className={`w-7 h-7 ${activePage === item.item_name ? 'filter brightness-0 invert' : ''}`}
                            alt={item.item_name}
                        />
                        <span className="text-sm md:text-base">{isOpen  ? item.item_name : ''}</span>
                    </div>
                ))}
            </div>
            <div className=' '>
 <div 
                className={`
                          flex items-center gap-5 p-4 rounded-[70px] cursor-pointer mb-2
                           transition-colors duration-200 ease-in-out hover:bg-blue-100  `}
                        >
                        <img
                            src={SettingImg}
                            className={`w-7 h-7`}
                        />
                        <Link to={isTeacherRoute ? "/teacherprofile" : "/studentprofile"}>
                        <span className="text-sm md:text-base hover:text-blue-700">{isOpen ? 'Settings' : ''}</span>
                        </Link>    
                    </div>
              
            
            <div className="mt-auto mb-[10px]">
                <div 
                    onClick={handleLogoClick} 
                    className='cursor-pointer flex items-center gap-3 p-4 rounded-[70px] transition-colors duration-200 ease-in-out hover:bg-red-50 hover:text-red-700 position-relative'
                >
                    <h1 className={`text-red-500 font-semibold text-xl px-8`}>{isOpen ? '   Logout' : ''}</h1>
                    <img src={MenuImg} className={`w-6 h-6  position-absolute ${isOpen ? 'ml-[-140px]' : 'ml-[-75px]'}`} alt="Logout" />
                </div>
            </div>
            </div>           
        </div>
    );
};

export default PageList;
