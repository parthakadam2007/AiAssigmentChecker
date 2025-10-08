const {Router} = require("express");
const router = Router();

const {
    handleGetClassInfoByStudentID,
    handleGetAssignmentsByAssignment_id,
    handleGetSubmissionsByAssigment_idAndStudent_id,
    handleGetClassesWithAttendanceByStudentId,
    handleGetAttendanceByStudentAndClass,
    // handleGetOverallAttendanceAnalytics,
    handleGetPerformanceAnalytics,
    handleGetGradesBySubmissionByStudent_idAndAssignment_id,
    handleGetSubmission_idByStudent_idAndAssignment_id
} = require("../controller/studentController")

const {
    handleGetAssignmentsByClass_id,
    handleGetClassInfoByClass_id,
    handleGetAssignments_attachmentsByAssignment_id,
    getAssignmentInfoByAssignment_id
} = require("../controller/classController")
const{handleGetStudentsByClass_id,handleGetJsonAssignmentCheckInfo} = require("../controller/teacherController")
////////////////GET ROUTES//////////////////////////////

router.get("/class",handleGetClassInfoByStudentID)
router.get("/class/:class_id",handleGetClassInfoByClass_id)
router.get("/class/assignments/:class_id",handleGetAssignmentsByClass_id)
router.get("/class/assignment/attachment/:assignment_id",handleGetAssignments_attachmentsByAssignment_id)
router.get("/class/assignment/:assignment_id",handleGetAssignmentsByAssignment_id)
router.get("/class/assignment/:assignment_id/submissions",handleGetSubmissionsByAssigment_idAndStudent_id)
router.get('/class/students/:class_id',handleGetStudentsByClass_id)
router.get("/class/assignment/:assignment_id/submission_id",handleGetSubmission_idByStudent_idAndAssignment_id)
router.get('/submission/:submission_id/student/:student_id', handleGetJsonAssignmentCheckInfo)
//ATTENDANCE ROUTES
router.get("/attendance/summary", handleGetClassesWithAttendanceByStudentId);
router.get("/attendance/detail/:class_id", handleGetAttendanceByStudentAndClass);
router.post("/attendance/mark/:session_id", handleMarkAttendanceByStudent);
router.get("/biometric_attendance/active_session/:class_id",handleGetActiveSessionByClassId);


//ANALYTICS ROUTES
router.get("/analytics/attendance", handleGetOverallAttendanceAnalytics);
router.get("/analytics/performance", handleGetPerformanceAnalytics);
router.get("/feedback/recent", handleGetRecentTestFeedback);
// GET all assignments for student across all classes with status
router.get("/assignments/student", handleGetStudentAssignmentsWithStatus);

// GET grade for a specific submission
router.get("/grades/submission/:submission_id", handleGetGradeBySubmissionId);

// GET assignment details with attachments and submission status
router.get("/assignment/detailed/:assignment_id", handleGetAssignmentDetailed);
router.get("/leaderboard", handleGetLeaderboard);
router.get("/leaderboard/personal", handleGetPersonalRanking);
router.get("/analytics/task-completion", handleGetTaskCompletionData);
router.get("/analytics/task-stats", handleGetTaskCompletionStats);


//////////////////POST ROUTES/////////////////////////
const uploadMiddleware = require('../services/myMulter');

const {handleSubmissionUpload}  = require("../controller/classController")
const {handleJointClassByJoiningID} =require("../controller/studentController")
router.post("/class/join",handleJointClassByJoiningID)
router.post("/class/assignment/:assignment_id/submissions", uploadMiddleware.array('files', 10),handleSubmissionUpload)


module.exports = router;