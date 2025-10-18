import { useParams } from "react-router-dom";
import Header from "../../../shared/components/header/Header";
import PageList from "../../../shared/components/sidebar/PageList";
// import StudentSubmission from "../components/assignment-submission-view/StudentSubmission";
import AssignmentCheck from "../components/assignment-submission-view/AssigmnmentCheck";
    
const DashboardAssigmentCheck: React.FC = () => {
    const { student_id } = useParams<{ student_id: string }>();
    const {submission_id} = useParams<{ submission_id: string }>();

    return (
        <div>
            <Header />
            <div className="flex h-[89vh]">
                <PageList />
                <AssignmentCheck student_id={student_id } submission_id={submission_id} />
            </div>
        </div>
    );
}


export default DashboardAssigmentCheck;