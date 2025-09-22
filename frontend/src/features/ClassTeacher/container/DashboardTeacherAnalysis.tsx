import Header from '../../../shared/components/header/Header';
import PageList from '../../../shared/components/sidebar/PageList';
import TeacherAnalysis from '../teacher-analysis/TeacherAnalysis';

const DashboardTeacherAnalysis = () => {
    return (
        <div>
            <Header />
            <div className="flex">
                <PageList />
                <TeacherAnalysis />
            </div>
        </div>
    );
};

export default DashboardTeacherAnalysis;