import { BrowserRouter, Routes, Route } from "react-router-dom";
import SigninPage from './features/auth/signup/continer/SigninPage';
import SingupPage from './features/auth/signup/continer/SignupPage'

import DashboardPage from './shared/containers/DashboardPage';
import DashboardTeacherClassPage from './features/ClassTeacher/container/DashboardTeacherClassPage'
import PageCreateAssignment from './features/ClassTeacher/container/PageCreateAssignment';
// import PageSubmission from './features/ClassTeacher/container/PageSubmission';
import DashboardStudentSubmission from './features/ClassTeacher/container/DashboardStudentSubmission'
import DashboardAssigmentCheck from './features/ClassTeacher/container/DashboardAssigmentCheck';

import PageAssignmentView from "./features/student/containers/PageAssignmentView";
import DashboardStudentClassPage from './features/student/containers/DashboardStudentClassPage';
import DashboardPageStudent from './features/student/containers/DashboardPageStudent';

import AIchatbot from "./features/AIChatbot/AIchatbot";
import TeacherProfilePage from "./features/ClassTeacher/profile-teacher/components/TeacherProfile";
import StudentProfilePage from "./features/student/profile-student/components/StudentProfile";

import PageAttendance from "./features/ClassTeacher/components/attendance/PageAttendance";
import DashboardTeacherAnalysis from "./features/ClassTeacher/container/DashboardTeacherAnalysis";


// import StudentAnalysis from "./features/student/student-analysis/StudentAnalysis";


//new
import PageAttendanceDashboard from "./features/student/containers/PageAttendanceDashboard";
import PageAttendanceDetail from "./features/student/containers/PageAttendanceDetail";
import DashboardStudentAnalysis from "./features/student/containers/DashboardStudentAnalysis";

//new end


function App() {


  return (
    <>
     <BrowserRouter>
      <Routes>

        {/* ----------AUTH ROUTES-------------- */}
        <Route path="/auth/signup" element={<SingupPage/>}></Route>
        <Route path="/auth/signin" element={<SigninPage/>}></Route>
        <Route path="/" element={<SigninPage/>}></Route>
        {/* ----------TEACHER ROUTES-------------- */}

        <Route path="/teacher" element={<DashboardPage/>}></Route>
        <Route path="/teacher/class/:class_id" element={<DashboardTeacherClassPage/>}></Route>
        <Route path="/teacher/class/:class_id/assignment/create" element={<PageCreateAssignment/>}></Route>
        <Route path="/teacher/class/:class_id/submission" element={<PageAssignmentView/>}></Route>
        <Route  path="/teacher/class/:class_id/student/:student_id" element={<DashboardStudentSubmission/>}></Route>
        {/*  */}
        <Route path="/teacher/student/:student_id/submission/:submission_id" element={<DashboardAssigmentCheck/>}></Route>
        <Route path="/aichat" element={<AIchatbot userType="teacher"/>}></Route>

        <Route path="/teacher/attendance/class/:class_id" element={<PageAttendance />} />
        <Route path="/teacher/analysis" element={<DashboardTeacherAnalysis />} />

        {/* --------------STUDENTS ROUTES --------------------*/}
        {/* <Route path="/student" element={<DashboardPageStudent/>}></Route> */}
        {/* <Route path="/student" element={<DashboardPage/>}></Route> */}

        {/* --------------STUDENTS ROUTES --------------------*/}

        <Route path="/student" element={<DashboardPageStudent/>}></Route>
        <Route path="/student/class/:class_id" element={<DashboardStudentClassPage/>}></Route>
        <Route path="/student/class/:class_id/assignment/:assignment_id" element={<PageAssignmentView/>}></Route>
        <Route path="/aichatStudent" element={<AIchatbot userType="student"/>}></Route>
        <Route path="/teacherprofile" element={<TeacherProfilePage/>}></Route> {/* Teacher Profile */}
        <Route path="/studentprofile" element={<StudentProfilePage/>}></Route> {/* Student Profile */}

        {/* <Route path="/analysis" element={<StudentAnalysis/>}></Route> */}
        {/* <Route path="/performance" element={<Performance/>}></Route> */}
        {/* <Route path="/progress" element={<Progress />}></Route> */}

        {/* Student Analysis Route */}
        <Route path="/student/analysis" element={<DashboardStudentAnalysis/>}></Route>

     
      <Route path="/student/attendance" element={<PageAttendanceDashboard />} />
      <Route path="/student/attendance/:class_id" element={<PageAttendanceDetail />} />

      

      </Routes>
    </BrowserRouter>
  
    </>
  )
}

export default App
