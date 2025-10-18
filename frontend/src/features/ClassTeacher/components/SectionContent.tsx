import React, { useState } from 'react';
import AssignmentPost from "../../student/components/AssigmentPost"
import useFetch from '../../../shared/hooks/UseFetch';
import CircularLoader from '../../../shared/components/loaders/CircularLoader';

interface SectionContent {
    class_id: number;
    class_name: string;
    section: string;
    subject: string;
    room: string;
    description: string;
    joining_code: string;
    uploaded_photo_url: string;
    teacher_id: number;
}

const SectionContent: React.FC<{ classInfo: SectionContent }> = ({ classInfo }) => {
    const { data, status } = useFetch<any>({ method: "GET", url: `${import.meta.env.VITE_BACKEND_URL}/class/assignments/${classInfo.class_id}` })

    // State to manage the class code copy button: 'copy' for the icon, 'copied' for the text
    const [buttonState, setButtonState] = useState<'copy' | 'copied'>('copy');

    const handleCopy = async () => {
        try {
            // Use the modern clipboard API
            await navigator.clipboard.writeText(classInfo.joining_code);

            // Set the state to 'copied'
            setButtonState('copied');

            // Revert the state back to 'copy' after 2 seconds
            const timeoutId = setTimeout(() => {
                setButtonState('copy');
            }, 2000); // 2 seconds
            console.log(timeoutId);
            // Note: In a class component, you'd handle cleanup in componentWillUnmount.
            // In a functional component, we can ignore the cleanup for this simple case 
            // since the component doesn't unmount immediately.
            // For best practice, if this component was more dynamic, you'd return the cleanup function.
            // return () => clearTimeout(timeoutId); 

        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers (document.execCommand is deprecated)
            // If you need a robust fallback, you'd re-implement your original logic here.
        }
    };


    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-6xl ml-[15px] ">

            {/* Class Banner */}
            <div className="relative h-48 bg-blue-600 flex items-end justify-between p-6 rounded-t-[10px]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 border-none rounded-t-[15px]"></div>
                {/* <h1 className="text-white text-3xl font-bold relative z-10">{classInfo.class_name}</h1> */}
                <button className="bg-white text-blue-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 relative z-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    Customize
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row p-6 border border-white mt-10">
                {/* Left Sidebar */}
                <div className="w-full md:w-1/3 pr-0 md:pr-6 mb-6 md:mb-0">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-gray-700 font-semibold">Class code</h3>
                            
                            {/* TARGET BUTTON: Modified to use state and handleCopy function */}
                            <button 
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                                onClick={handleCopy}
                                aria-label={buttonState === 'copy' ? 'Copy class code' : 'Class code copied'}
                            >
                                {buttonState === 'copy' ? (
                                    // Original Icon replaced with a common 'Copy' icon for better UX 
                                    // (If you prefer the original icon, use the path below this one)
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-0 w-0" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M8 7v4a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h3m4 0v4a1 1 0 001 1h3a1 1 0 001-1V7a1 1 0 00-1-1h-3m-4 0V4a1 1 0 011-1h3a1 1 0 011 1v2m-4 0h4" 
                                        />
                                    </svg>
                                    /* Original SVG path (Looks like a Plus sign, not Copy): 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0H6" />
                                    </svg> 
                                    */
                                ) : (
                                    <span className="text-gray-700 font-normal">Copied!</span>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-blue-600 text-lg font-mono tracking-wider">
                                {classInfo.joining_code}
                            </span>
                            
                            {/* SECOND BUTTON: Removed the logic as it's now handled by the top button */}
                            <button className="ml-2 text-gray-500 hover:text-blue-600"
                                onClick={handleCopy} // Re-using handleCopy for the second button as well, but it only changes the *top* button's state
                                aria-label="Copy class code"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-gray-700 font-semibold mb-2">Upcoming</h3>
                        <p className="text-gray-500 text-sm mb-4">No work due soon</p>
                        <button className="text-blue-600 hover:underline text-sm font-medium">View all</button>
                    </div>
                </div>

                {/* Main Stream Content */}
                <div className="w-full md:w-2/3 ">
                    {/* Announce something section */}
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-500 text-white flex items-center justify-center rounded-full font-bold text-lg mr-4">
                            P
                        </div>
                        <input
                            type="text"
                            placeholder="Announce something to your class"
                            className="flex-grow bg-transparent border-none focus:outline-none text-gray-700"
                        />
                        <button className="text-gray-500 hover:text-gray-700 ml-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </button>
                    </div>

                    {/* Assignment Posts */}
                    <div className="w-full ">
                        <div className="h-[150px] overflow-y-scroll">
                            {data && data.length > 0 ? (
                                data.map((assignment: any) => (
                                    <div className='mb-4 ' key={assignment.assignment_id}>
                                        <AssignmentPost key={assignment.assignment_id} assignment={assignment} />
                                    </div>
                                ))
                            ) : (
                                <div className='text-center text-gray-500 '>
                                    {status === 'loading' ? <div className='mt-[50px] ml-[200px]'><CircularLoader /> </div> : 'No assignments available.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SectionContent;