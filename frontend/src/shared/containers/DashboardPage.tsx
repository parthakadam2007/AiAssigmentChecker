import React from 'react';
import Header from '../components/header/Header';
import PageList from '../components/sidebar/PageList';
import PagecontentSide from '../components/content-side/container/PagecontentSide';
// import UseProtectedPage from '../hooks/UseProtectedPage';
const DashboardPage: React.FC = () => {
    return (
        <div>
            {/* <UseProtectedPage/> */}
            <Header/>
            <div className='flex h-[89vh]'>
            <PageList />
            <PagecontentSide/>
            </div>

        </div>
    );
};

export default DashboardPage;