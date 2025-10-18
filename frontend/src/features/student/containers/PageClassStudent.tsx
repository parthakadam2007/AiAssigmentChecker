// import ClassSection from "../../ClassTeacher/components/classSection"
// import ClassWork from "../../ClassTeacher/components/ClassWork"
import ClassPeople from "../../ClassTeacher/components/ClassPeople"
import Tab from "../../ClassTeacher/components/Tab"
import StudentSection from "../components/StudentSection"
import StudentClassWork from "../components/StudentClassWork"
import { useSelector } from "react-redux"

const PageClassStudent: React.FC<{ class_id: string }> = ({ class_id }) => {
    // const dispatch = useDispatch();
    let currentTab = useSelector((state: any) => state.shared.tabStatus.activeTab);
    return (
        <div className="w-[1500px] bg-gray-50 rounded-l-3xl overflow-y-scroll">
            <Tab list={[{ item_name: "Section" }, { item_name: "Classwork" }, { item_name: "People" }]} />

            {currentTab === "Section" ? (
                // <ClassSection class_id={String(class_id)} />
                <StudentSection class_id={String(class_id)}/>

            ) : currentTab === "Classwork" ? (
                <StudentClassWork class_id={String(class_id)}/>
            ) : currentTab === "People" ? (
                // Render People component here
                <ClassPeople class_id={String(class_id)} role={"student"}/>
            ) : null}

        </div>
    )
}

export default PageClassStudent