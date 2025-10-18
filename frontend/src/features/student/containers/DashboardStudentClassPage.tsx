import { useParams } from "react-router-dom";
import Header from "../../../shared/components/header/Header";
import PageList from "../../../shared/components/sidebar/PageList";
import PageClassStudent from "./PageClassStudent";
const DashboardStudentClassPage: React.FC = () => {
    const {  class_id } = useParams<{ classId: string, class_id: string }>();
    console.log( "class_id", typeof(class_id));
    return (
        <div>
            <Header />
            <div className="flex h-[89vh]">
                <PageList userType="student"/>
                <PageClassStudent class_id={String(class_id)} />
            </div>
        </div>
    );
}


export default DashboardStudentClassPage;