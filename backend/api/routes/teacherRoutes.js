const { Router } = require('express')
const router = Router()


///////////////////POST ROUTS////////////////////////
const {
    handleCreateClass,
    handleGetClassByTeacher_id,
    handleGetStudentsByClass_id,
    handleGetJsonBuildObjectSubmission,
    handleGetJsonBuildObjectStudentSubmission,
    handleGetStudentByStudent_id,
    handleGetJsonAssignmentCheckInfo,
    handleCreateAttendance,
    handlestartSession,
    handleEndSession,
    handleGetClassById,
    handleGetAttendanceOfClassByClassId,
    // analytics
    handleGetTeacherClassroomOverview,
    handleGetTeacherClassStatistics,
    handleGetTeacherClassFeedbackSummary,
    handleGetClassDetailedFeedback,
    handleGetTeacherCommonIssues,
} = require('../controller/teacherController')
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/classes', handleCreateClass);
router.post('/attendance', handleCreateAttendance);

// biometric attendance
router.post("/biometric_attendance/start_session", handlestartSession);
router.post("/biometric_attendance/end_session", handleEndSession);


// alert
///////////////////GET ROUTS////////////////////////
router.get('/classes', handleGetClassByTeacher_id)
router.get('/class/students/:class_id', handleGetStudentsByClass_id)
router.get('/class/:class_id', handleGetClassById)
router.get('/class/submissions/:class_id', handleGetJsonBuildObjectSubmission)
router.get('/class/submissions/:class_id/student/:student_id', handleGetJsonBuildObjectStudentSubmission)
router.get('/student/:student_id', handleGetStudentByStudent_id)
router.get('/submission/:submission_id/student/:student_id', handleGetJsonAssignmentCheckInfo)
//Attendance route
router.get('/attendance/class/:class_id', handleGetAttendanceOfClassByClassId)


// ================ TEACHER ANALYTICS ROUTES ================

router.get("/analytics/classroom-overview", handleGetTeacherClassroomOverview);
router.get("/analytics/class-statistics", handleGetTeacherClassStatistics);
router.get("/analytics/class-feedback", handleGetTeacherClassFeedbackSummary);
router.get("/analytics/class-feedback/:class_id", handleGetClassDetailedFeedback);
router.get("/analytics/common-issues", handleGetTeacherCommonIssues);


// This router is mounted behind auth in server.js; do not add middleware here
// Full path becomes: /api/alerts/send


module.exports = router