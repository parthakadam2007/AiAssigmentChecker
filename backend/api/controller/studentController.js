
///////////////////GET CONTROLLER////////////////////
const { getClassInfoByStudentId } = require("../models/studentModels")
const {
        getAssignments_attachmentsByAssignment_id,
        getSubmissionsByAssigment_idAndStudent_id,

        getClassesWithAttendanceByStudentId,
        getAttendanceByStudentAndClass,
        getSubmission_idByStudent_idAndAssignment_id,
        getOverallAttendanceAnalytics,
        getPerformanceAnalytics,
        getRecentTestFeedback,
        getActiveSessionByClassId,
        getStudentAssignmentsWithStatus,
        getGradeBySubmissionId,
        getAssignmentDetailed,
        getLeaderboardData,
        calculateStudentBadges,
        getTaskCompletionData,
        getTaskCompletionStats,
        } = require("../models/studentModels");
const {
        getAssignmentInfoByAssignment_id,

} = require("../models/classModels");


handleGetClassInfoByStudentID = async (req, res) => {
    try {
        const student_id = req.user.student_id;
        const result = await getClassInfoByStudentId(student_id);
        res.status(200).json(result)
    } catch (err) {

        console.error('Error creating class:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleGetAssignmentsByAssignment_id = async (req, res) => {
    try {
        const assignment_id = req.params.assignment_id;
        const result = await getAssignmentInfoByAssignment_id(assignment_id);
        res.status(200).json(result)
    } catch (err) {

        console.error('Error fetching assignments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
handleGetSubmissionsByAssigment_idAndStudent_id = async (req, res) => {
    try {
        const assignment_id = req.params.assignment_id;
        const student_id = req.user.student_id;
        const result = await getSubmissionsByAssigment_idAndStudent_id(student_id, assignment_id);
        res.status(200).json(result)
    } catch (err) {

        console.error('Error fetching assignments handleGetSubmissionsByAssigment_idAndStudent_id:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleGetGradesBySubmissionByStudent_idAndAssignment_id = async (req, res) => {
    try {
        const assignment_id = req.params.assignment_id;
        const student_id = req.user.student_id;
        const result = await getGradesBySubmissionByStudent_idAndAssignment_id(student_id, assignment_id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching grades by submission and student ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/// //////Analytics//////

handleGetOverallAttendanceAnalytics = async (req, res) => {
  try {
    const student_id = req.user.student_id;
    const period = req.query.period || 'current-month'; // Get period from query params
    
    const result = await getOverallAttendanceAnalytics(student_id, period);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching overall attendance analytics:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


handleGetPerformanceAnalytics = async (req, res) => {
  try {
    const student_id = req.user.student_id;
    const period = req.query.period || 'current-semester';
    
    const result = await getPerformanceAnalytics(student_id, period);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching performance analytics:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

handleGetRecentTestFeedback = async (req, res) => {
  try {
    const student_id = req.user.student_id;
    const limit = parseInt(req.query.limit) || 3;
    
    const result = await getRecentTestFeedback(student_id, limit);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching recent test feedback:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// ================ ASSIGNMENT CONTROLLERS ================

handleGetStudentAssignmentsWithStatus = async (req, res) => {
    try {
        const student_id = req.user.student_id;
        const result = await getStudentAssignmentsWithStatus(student_id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching student assignments with status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleGetGradeBySubmissionId = async (req, res) => {
    try {
        const { submission_id } = req.params;
        const result = await getGradeBySubmissionId(submission_id);
        
        if (!result) {
            return res.status(404).json({ error: 'Grade not found' });
        }
        
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching grade by submission ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleGetAssignmentDetailed = async (req, res) => {
    try {
        const assignment_id = req.params.assignment_id;
        const student_id = req.user.student_id;
        const result = await getAssignmentDetailed(assignment_id, student_id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching detailed assignment:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleGetSubmission_idByStudent_idAndAssignment_id = async (req, res) => {
    try {
        const assignment_id = req.params.assignment_id;
        const student_id = req.user.student_id;

        const result = await getSubmission_idByStudent_idAndAssignment_id(student_id, assignment_id);
        console.log("Fetched submission ID result:", student_id, assignment_id);
        // result = { ...result, student_id: student_id, assignment_id: assignment_id }; // include IDs in response
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching submission ID by student and assignment ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// ================ LEADERBOARD CONTROLLERS ================

handleGetLeaderboard = async (req, res) => {
    try {
        const { class_id } = req.query;
        const studentData = await getLeaderboardData(class_id || null);

        // Enhance data with rankings and badges
        const leaderboardWithRankings = await Promise.all(
            studentData.map(async (student, index) => {
                const badges = await calculateStudentBadges(student);
                
                return {
                    rank: index + 1,
                    student_id: student.student_id,
                    name: student.name,
                    avatar: student.avatar || '/diverse-student-profiles.png',
                    badges: badges,
                    metrics: {
                        average_grade: Math.round(student.average_grade),
                        submission_rate: student.total_assignments > 0 
                            ? Math.round((student.submitted_assignments / student.total_assignments) * 100)
                            : 0,
                        attendance_rate: student.total_classes > 0
                            ? Math.round((student.present_classes / student.total_classes) * 100)
                            : 0,
                        total_points: student.total_points
                    }
                };
            })
        );

        res.status(200).json(leaderboardWithRankings);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get personal ranking for current student
handleGetPersonalRanking = async (req, res) => {
    try {
        const student_id = req.user.student_id;
        const { class_id } = req.query;
        
        const allStudents = await getLeaderboardData(class_id || null);
        const personalRank = allStudents.findIndex(student => student.student_id === student_id) + 1;
        const totalStudents = allStudents.length;

        if (personalRank === 0) {
            return res.status(404).json({ error: 'Student not found in rankings' });
        }

        const personalData = allStudents[personalRank - 1];
        const badges = await calculateStudentBadges(personalData);

        res.status(200).json({
            rank: personalRank,
            total_students: totalStudents,
            name: personalData.name,
            avatar: personalData.avatar || '/diverse-student-profiles.png',
            badges: badges,
            metrics: {
                average_grade: Math.round(personalData.average_grade),
                submission_rate: personalData.total_assignments > 0 
                    ? Math.round((personalData.submitted_assignments / personalData.total_assignments) * 100)
                    : 0,
                attendance_rate: personalData.total_classes > 0
                    ? Math.round((personalData.present_classes / personalData.total_classes) * 100)
                    : 0,
                total_points: personalData.total_points
            }
        });
    } catch (err) {
        console.error('Error fetching personal ranking:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// handleGetAssignmentsAttachmentsByAssignment_id = async (req, res) => {
//     try {
//         const assignment_id = req.params.assignment_id;
//         const result = await getAssignments_attachmentsByAssignment_id(assignment_id);
//         res.status(200).json(result)
//     } catch (err) {

//         console.error('Error fetching assignments:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }




///////////////////POST CONTROLLER////////////////////
const { joinClass } = require("../models/classModels");
const { handleGetAssignmentsByClass_id } = require("./classController");
handleJointClassByJoiningID = async (req, res) => {
    try {
        const student_id = req.user.student_id;
        const { joining_code } = req.body
        const result = await joinClass(joining_code, student_id);
        res.status(200).json(result)
    } catch (err) {

        console.error('Error creating class:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Overall summary: all classes with attendance %
handleGetClassesWithAttendanceByStudentId = async (req, res) => {
  try {
    const student_id = req.user.student_id; 
    const result = await getClassesWithAttendanceByStudentId(student_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching attendance summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Detail: date-wise attendance for a single class
handleGetAttendanceByStudentAndClass = async (req, res) => {
  try {
    const student_id = req.user.student_id;
    const class_id = req.params.class_id;
    const result = await getAttendanceByStudentAndClass(student_id, class_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching class attendance detail:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ================ TASK COMPLETION CHART CONTROLLERS ================

handleGetTaskCompletionData = async (req, res) => {
    try {
        const student_id = req.user.student_id;
        const { period = 'current-month' } = req.query;
        
        const chartData = await getTaskCompletionData(student_id, period);
        const stats = await getTaskCompletionStats(student_id, period);

        res.status(200).json({
            chartData,
            stats
        });
    } catch (err) {
        console.error('Error fetching task completion data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

handleGetTaskCompletionStats = async (req, res) => {
    try {
        const student_id = req.user.student_id;
        const { period = 'current-month' } = req.query;
        
        const stats = await getTaskCompletionStats(student_id, period);

        res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching task completion stats:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//end new attendance

// inform student with session_id

// Student: Get active session info for a class
// handleGetActiveSessionByClassId = async (req, res) => {
//     try {
//         const { class_id } = req.params;
//         const session = await getActiveSessionByClassId(class_id);

//         if (!session) {
//             return res.json({ active: false });
//         }

//         res.json({
//             active: true,
//             ...session, // contains session_id, start_time, end_time, method
//         });
//     } catch (err) {
//         console.error("Error fetching active session:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };


handleMarkAttendanceByStudent = async (req, res) => {
    try {
        const student_id = req.user.student_id;
        const { session_id } = req.params;
        const { status, method } = req.body; // e.g., { "status": "Present", "method": "self_mark" }

        const result = await markAttendanceForSession(student_id, session_id, status, method);

        res.status(200).json({ success: true, result });
    } catch (err) {
        console.error("Error marking attendance:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// GET active session for a class
handleGetActiveSessionByClassId = async (req, res) => {
    try {
        const { class_id } = req.params;
        const session = await getActiveSessionByClassId(class_id);

        if (!session) {
            return res.status(200).json({ active: false });
        }

        res.status(200).json({
            active: true,
            session_id: session.session_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    handleGetClassInfoByStudentID,
    handleGetAssignmentsByAssignment_id,
    handleGetSubmissionsByAssigment_idAndStudent_id,
    handleGetClassesWithAttendanceByStudentId,
    handleGetAttendanceByStudentAndClass,
    handleGetGradesBySubmissionByStudent_idAndAssignment_id,
    handleGetSubmission_idByStudent_idAndAssignment_id,

    handleGetOverallAttendanceAnalytics,
    handleGetPerformanceAnalytics,
    handleGetRecentTestFeedback,
    handleJointClassByJoiningID,
    handleGetLeaderboard,
    handleGetPersonalRanking,
    handleGetTaskCompletionData,
    handleGetTaskCompletionStats,

    handleMarkAttendanceByStudent,
    handleGetActiveSessionByClassId,
    handleMarkAttendanceByStudent,
    handleGetStudentAssignmentsWithStatus,
    handleGetGradeBySubmissionId,
    handleGetAssignmentDetailed,
}