import HomeImg from '../../../assets/home.svg';
import MenuImg from '../../../assets/logout.svg';
import SettingImg from '../../../assets/settings.svg'
import DashboardImg from '../../../assets/dashboardImg.svg';
import AnalyticsImg from '../../../assets/Analytics.svg';
import RobotImg from '../../../assets/Robot_2.svg';
import { useDispatch, useSelector } from 'react-redux';
import { updatesidebarStatus } from '../../slices/sharedSlice';
import { useNavigate } from 'react-router-dom';

// Define the shape of your Redux state
interface RootState {
    shared: {
        sidebarStatus: {
            activePage: string;
            isOpen: boolean;
        };
    };
}

const PageList = () => {
    const dispatch = useDispatch();
    const activePage = useSelector((state: RootState) => state.shared.sidebarStatus.activePage);
    const isOpen = useSelector((state: RootState) => state.shared.sidebarStatus.isOpen);
    const navigate = useNavigate();
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
        { item_name: 'Home', item_img: HomeImg ,navigate:"/teacher"},
        { item_name: 'Dashboard', item_img: DashboardImg,navigate:"/dashboard"},
        { item_name: 'Analysis', item_img: AnalyticsImg,navigate:"/analysis"},
        { item_name: 'Chatbox', item_img: RobotImg,navigate:"/aichat"},
        { item_name: 'Emergency', item_img: '',navigate:"/emergency"}
    ];

    return (
        <div className="w-75 p-4 flex flex-col min-h-screen" style={{ width: isOpen ? '300px' : '75px', transition: 'width 0.2s'}}>

            <div className="flex-grow" >
                {pageList.map((item) => (
                    <div
                        key={item.item_name}
                        onClick={() => handleItemSelection(item.item_name)}
                        
                        className={`
                            flex items-center gap-5 p-3 rounded-[70px] cursor-pointer mb-2
                            transition-colors duration-200 ease-in-out
                            ${activePage === item.item_name
                                ? 'bg-blue-500 text-white font-semibold shadow-inner'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
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
                
            <div 
                className={`
                          flex items-center gap-5 p-3 rounded-[70px] cursor-pointer mb-2
                           transition-colors duration-200 ease-in-out hover:bg-blue-100 `}
                        >
                        <img
                            src={SettingImg}
                            className={`w-7 h-7`}
                        />
                        <span className="text-sm md:text-base hover:text-blue-700">{isOpen ? 'Settings' : ''}</span>
                    </div>
              
            {/* Logout button positioned 200px from bottom */}
            <div className="mt-auto mb-[70px]">
                <div 
                    onClick={handleLogoClick} 
                    className='cursor-pointer flex items-center gap-3 p-3 rounded-[70px] transition-colors duration-200 ease-in-out hover:bg-red-50 hover:text-red-700'
                >
                    <h1 className='text-red-500 font-semibold text-xl px-8'>{isOpen ? 'Logout' : ''}</h1>
                    <img src={MenuImg} className='w-6 h-6' alt="Logout" />
                </div>
            </div>
        </div>
    );
};

export default PageList;