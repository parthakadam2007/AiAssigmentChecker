import { useParams } from "react-router-dom";
import Header from "../../../shared/components/header/Header";
import PageList from "../../../shared/components/sidebar/PageList";
// import StudentSubmission from "../components/assignment-submission-view/StudentSubmission";
import AssignmentCheck from "../../ClassTeacher/components/assignment-submission-view/AssigmnmentCheck";

import useFetch from "../../../shared/hooks/UseFetch";
const DashboardAssigmentCheck: React.FC = () => {
    const {assignment_id} = useParams<{ assignment_id: string }>();

    const { data } = useFetch<{ assignment_id: string; student_id: string; submission_id: string }>({
        method: "GET",
        url: `${import.meta.env.VITE_BACKEND_URL}/student/class/assignment/${assignment_id}/submission_id`
        // /class/assignment/:assignment_id/submission_id
    });
    console.log("submission_id from api:",data);

    return (
 
        <div>
            <Header />
            <div className="flex ">
                <PageList userType="student"/>
                {data && <AssignmentCheck student_id={data.student_id} submission_id={data.submission_id} />}
            </div>
        </div>
    );
}


export default DashboardAssigmentCheck;