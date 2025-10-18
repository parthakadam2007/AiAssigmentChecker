import { useParams } from "react-router-dom";
import Header from "../../../shared/components/header/Header";
import PageList from "../../../shared/components/sidebar/PageList";
import PageClassTeacher from "./PageClassTeacher";
import { useEffect } from "react";


import { useDispatch } from "react-redux";
import { updateAssignmentUploadHandle } from "../../../shared/slices/sharedSlice"

const DashboardTeacherClassPage: React.FC = () => {
    const { class_id } = useParams<{ classId: string, class_id: string }>();
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(updateAssignmentUploadHandle({
            ReadyToUpload: false,
            assignment_id: ""
        }))
    }, [])

    return (
        <div>
            <Header />
            <div className="flex h-[89vh]">
                <PageList />
                <PageClassTeacher class_id={String(class_id)}  />
            </div>
        </div>
    );
}


export default DashboardTeacherClassPage;