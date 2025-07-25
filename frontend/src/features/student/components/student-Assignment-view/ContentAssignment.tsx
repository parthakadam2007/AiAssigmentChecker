import useFetch from "../../../../shared/hooks/UseFetch";
import { useParams } from "react-router-dom";
const ContentAssignment: React.FC = () => {
    const { assignment_id } = useParams()
    const { data:dataAssignmentAttachment, 
        error:errorAssignmentAttachment, 
        status:statusAssignmentAttachment } = useFetch({
        method: "GET",
        url:  `http://localhost:3000/api/student/class/assignment/attachment/${assignment_id}`
    });
        const { 
        data:dataAssignment, 
        error:errorAssignment, 
        status:statusAssignment } = useFetch({
        method: "GET",
        url:  `http://localhost:3000/api/student/class/assignment/${assignment_id}`
    });

    return (

        <div>
            {JSON.stringify(dataAssignment)}
            -------------------------------------
            {JSON.stringify(dataAssignmentAttachment)}
            ContentAssignment
        </div>
    )
}

export default ContentAssignment;