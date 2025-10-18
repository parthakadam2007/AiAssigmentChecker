import ClassSection from "../components/classSection"
import ClassWork from "../components/ClassWork"
import ClassPeople from "../components/ClassPeople"
import ClassAttendance from "../components/attendance/ClassAttendance"
import Tab from "../components/Tab"
import PageSubmission from "./PageSubmission"

import { useSelector } from "react-redux"

const PageClassTeacher: React.FC<{ class_id: string }> = ({ class_id }) => {
    let currentTab = useSelector((state: any) => state.shared.tabStatus.activeTab);

    // Determine which component to render based on the active tab
    const renderComponent = () => {
        switch (currentTab) {
            case "Section":
                return <ClassSection class_id={String(class_id)} />;
            case "Classwork":
                return <ClassWork class_id={String(class_id)} />;
            case "People":
                return <ClassPeople class_id={String(class_id)} role={"teacher"} />;
            case "Grades":
                return <PageSubmission class_id={String(class_id)} />;
            case "Attendance":

                return <ClassAttendance class_id={String(class_id)} />;
            default:
                // Fallback to the default view, or render nothing
                return null;
        }
    };

    return (
        <div className="w-full bg-gray-50 rounded-3xl overflow-y-scroll">
            <Tab list={[{ item_name: "Section" }, { item_name: "Classwork" }, { item_name: "People" }, { item_name: "Grades" }, { item_name: "Attendance" }]} />
            {renderComponent()}
        </div>
    );
};

export default PageClassTeacher;