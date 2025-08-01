import HomeImg from '../../../assets/home.svg';
import SettingImg from '../../../assets/settings.svg';
import MenuImg from '../../../assets/logout.svg'
import { useDispatch, useSelector } from 'react-redux';
import { updatesidebarStatus } from '../../slices/sharedSlice';
import { useNavigate } from 'react-router-dom';

// Define the shape of your Redux state
interface RootState {
    shared: {
        sidebarStatus: {
            activePage: string;
        };
    };
}

const PageList = () => {
    const dispatch = useDispatch();
    const activePage = useSelector((state: RootState) => state.shared.sidebarStatus.activePage);
    const navigate = useNavigate();
    const handleLogoClick = () => {
        console.log("to home")
        navigate("/")
    }

    const handleItemSelection = (itemName: string) => {
        console.log('state update');
        dispatch(updatesidebarStatus({ activePage: itemName }));
    };

    const pageList = [
        { item_name: 'Home', item_img: HomeImg },
        { item_name: 'Settings', item_img: SettingImg },
    ];

    return (
        <div className="w-75 p-4 flex flex-col min-h-screen ">
            {/* Main content area that will grow and push the logout down */}
            <div className="flex-grow">
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
                        <span className="text-sm md:text-base">{item.item_name}</span>
                    </div>
                ))}
            </div>
            
            {/* Logout button positioned 200px from bottom */}
            <div className="mt-auto mb-[70px]">
                <div 
                    onClick={handleLogoClick} 
                    className='cursor-pointer flex items-center gap-3 p-3 rounded-[70px] transition-colors duration-200 ease-in-out hover:bg-red-50 hover:text-red-700'
                >
                    <h1 className='text-red-500 font-semibold text-xl px-8'>Logout</h1>
                    <img src={MenuImg} className='w-6 h-6' alt="Logout" />
                </div>
            </div>
        </div>
    );
};

export default PageList;