const { pool, bcrypt } = require('./database');

////////////POST MODULES/////////////////////////
createStudent = async (studentData) => {
  const { first_name, last_name, email, password } = studentData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO students (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [first_name, last_name, email, hashedPassword];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }

}




getClassInfoByStudentId = async (student_id) => {
  const query = `
    SELECT 
      t.first_name || ' ' || t.last_name AS teacher_name,
      c.class_id,
      c.class_name,
      c.section,
      c.subject,
      c.room,
      c.description,
      c.uploaded_photo_url
    FROM 
      class_students cs
    JOIN 
      classes c ON c.class_id = cs.class_id
    JOIN 
      teachers t ON c.teacher_id = t.teacher_id
    WHERE 
      cs.student_id = $1;

  `
  try {
    const result = await pool.query(query, [student_id]);
    return result.rows;

  } catch (error) {
    console.error('Error fetching student by email:', error);
    throw error;
  }
}

getStudentByEmail = async (email) => {
  const query = 'SELECT * FROM students WHERE email = $1';

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching student by email:', error);
    throw error;
  }
}

getClass_idByStudent_id = async (student_id) => {
  const query = `
    SELECT class_id FROM class_students WHERE student_id = $1
  `;

  try {
    const result = await pool.query(query, [student_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching class ID from student ID:', error);
    throw error;
  }
}

getStudentsByClass_id = async (class_id) => {
  const query = `
    SELECT students.student_id, first_name, last_name, email, url_dp
    FROM students
    INNER JOIN class_students 
      ON students.student_id = class_students.student_id
    WHERE class_students.class_id = $1
  `;

  try {
    const result = await pool.query(query, [class_id]);
    return result.rows;
  } catch (error) {
    console.error('Error getStudentsByClass_id:', error);
    throw error;
  }
};

getSubmissionsByAssigment_idAndStudent_id = async (student_id,assignmnet_id) => {
  const query = `
    SELECT *
    FROM submissions
    WHERE student_id = $1
    AND assignment_id = $2
  `;

  try {
    const result = await pool.query(query, [student_id,assignmnet_id]);
    return result.rows;
  } catch (error) {
    console.error('Error getSubmissionsByAssigment_idAndStudent_id:', error);
    throw error;
  }
};

getGradesBySubmissionByStudent_idAndAssignment_id = async (student_id, assignment_id) => {
  const query = `
    SELECT g.*
    FROM grades g
    JOIN submissions s ON g.submission_id = s.submission_id
    WHERE s.student_id = $1 AND s.assignment_id = $2
  `;

  try {
    const result = await pool.query(query, [student_id, assignment_id]);
    return result.rows;
  } catch (error) {
    console.error('Error getGradesBySubmissionByStudent_idAndAssignment_id:', error);
    throw error;
  }
}

getStudentByStudent_id = async (student_id) => {
  const query = 'SELECT first_name , last_name FROM students WHERE student_id = $1';

  try {
    const result = await pool.query(query, [student_id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    throw error;
  }
};

//shaivi first sample

// Get classes + overall attendance for a student
// 1. Get summary: all classes + attendance %
const getClassesWithAttendanceByStudentId = async (student_id) => {
  const query = `
    SELECT 
      c.class_id,
      c.class_name,
      COUNT(a.attendance_id) AS total_classes,
      COUNT(a.attendance_id) FILTER (WHERE a.status = 'Present') AS present_count
    FROM classes c
    JOIN class_students cs ON cs.class_id = c.class_id
    LEFT JOIN attendance a 
      ON a.class_id = c.class_id AND a.student_id = cs.student_id
    WHERE cs.student_id = $1
    GROUP BY c.class_id, c.class_name
  `;
  const { rows } = await pool.query(query, [student_id]);
  return rows.map(r => ({
    class_id: r.class_id,
    class_name: r.class_name,
    total_classes: r.total_classes,
    present: r.present_count,
    attendance_percentage: r.total_classes > 0
      ? ((r.present_count / r.total_classes) * 100).toFixed(1)
      : 0
  }));
};

// 2. Get detail: date-wise attendance for one class
const getAttendanceByStudentAndClass = async (student_id, class_id) => {
  const query = `
    SELECT a.date, a.status
    FROM attendance a
    WHERE a.student_id = $1 AND a.class_id = $2
    ORDER BY a.date DESC
  `;
  const { rows } = await pool.query(query, [student_id, class_id]);
  return rows;
};


// end shaivi first sample

// attendence query to mark biometric attendence
async function markAttendanceForSession(student_id, session_id, status, method) {
  const query = `
    INSERT INTO attendance (student_id, session_id, status, method)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (student_id, session_id)
    DO UPDATE SET status = EXCLUDED.status, method = EXCLUDED.method, time_marked = CURRENT_TIME
    RETURNING *;
  `;
  const values = [student_id, session_id, status, method];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// attendence query to get active session by students
async function getActiveSessionByClassId(class_id) {
  const query = `
    SELECT session_id
    FROM attendance_sessions
    WHERE class_id = $1 AND is_active = TRUE
    ORDER BY start_time DESC
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [class_id]);
  return rows[0] || null;
}


/////////////////Analytics PageModels////////////

const getOverallAttendanceAnalytics = async (student_id, period = 'current-month') => {
  // Determine date range based on period
  let dateCondition = '';
  let dateParams = [student_id];
  
  switch(period) {
    case 'current-month':
      dateCondition = `AND a.date >= date_trunc('month', CURRENT_DATE)`;
      break;
    case 'last-month':
      dateCondition = `AND a.date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                       AND a.date < date_trunc('month', CURRENT_DATE)`;
      break;
    case 'semester':
      // Adjust this based on your semester definition
      dateCondition = `AND a.date >= CURRENT_DATE - INTERVAL '6 months'`;
      break;
    default:
      dateCondition = '';
  }
  
  const query = `
    SELECT 
      -- Total attended classes
      COUNT(a.attendance_id) FILTER (WHERE a.status = 'Present') AS attended_classes,
      -- Total missed classes
      COUNT(a.attendance_id) FILTER (WHERE a.status = 'Absent') AS missed_classes,
      -- Total classes with attendance taken
      COUNT(a.attendance_id) AS total_classes_with_attendance,
      -- Total classes enrolled (regardless of attendance taken)
      COUNT(DISTINCT cs.class_id) AS total_enrolled_classes,
      -- Classes that have had attendance taken
      COUNT(DISTINCT CASE WHEN a.attendance_id IS NOT NULL THEN cs.class_id END) AS classes_with_attendance
    FROM class_students cs
    LEFT JOIN attendance a 
      ON a.class_id = cs.class_id 
      AND a.student_id = cs.student_id
      ${dateCondition}
    WHERE cs.student_id = $1
  `;
  
  try {
    const { rows } = await pool.query(query, [student_id]);
    const data = rows[0];
    
    // Calculate percentages only for classes that have attendance records
    const attendancePercentage = data.total_classes_with_attendance > 0 
      ? (data.attended_classes / data.total_classes_with_attendance) * 100 
      : 0;
    
    return {
      attended: parseInt(data.attended_classes) || 0,
      missed: parseInt(data.missed_classes) || 0,
      total_classes: parseInt(data.total_classes_with_attendance) || 0,
      enrolled_classes: parseInt(data.total_enrolled_classes) || 0,
      classes_with_attendance: parseInt(data.classes_with_attendance) || 0,
      percentage: parseFloat(attendancePercentage.toFixed(1))
    };
  } catch (error) {
    console.error('Error in getOverallAttendanceAnalytics:', error);
    throw error;
  }
};

const getPerformanceAnalytics = async (student_id, period = 'current-semester') => {
  // Determine date range based on period
  let dateCondition = '';
  
  switch(period) {
    case 'current-semester':
      dateCondition = `AND a.created_date >= CURRENT_DATE - INTERVAL '6 months'`;
      break;
    case 'last-semester':
      dateCondition = `AND a.created_date >= CURRENT_DATE - INTERVAL '12 months' 
                       AND a.created_date < CURRENT_DATE - INTERVAL '6 months'`;
      break;
    case 'all-time':
      dateCondition = '';
      break;
    default:
      dateCondition = `AND a.created_date >= CURRENT_DATE - INTERVAL '6 months'`;
  }
  
  const query = `
    SELECT 
      c.class_id,
      c.class_name,
      c.subject,
      COUNT(DISTINCT a.assignment_id) AS total_assignments,
      COUNT(DISTINCT s.submission_id) AS submitted_assignments,
      COALESCE(AVG(g.obtained_grade), 0) AS average_grade,
      MAX(g.obtained_grade) AS highest_grade,
      MIN(g.obtained_grade) AS lowest_grade
    FROM class_students cs
    JOIN classes c ON c.class_id = cs.class_id
    LEFT JOIN assignments a ON a.class_id = c.class_id ${dateCondition}
    LEFT JOIN submissions s ON s.assignment_id = a.assignment_id AND s.student_id = cs.student_id
    LEFT JOIN grades g ON g.submission_id = s.submission_id
    WHERE cs.student_id = $1
    GROUP BY c.class_id, c.class_name, c.subject
    HAVING COUNT(DISTINCT a.assignment_id) > 0
    ORDER BY c.subject;
  `;
  
  try {
    const { rows } = await pool.query(query, [student_id]);
    
    // Calculate class average for each subject
    const classAveragesQuery = `
      SELECT 
        c.subject,
        COALESCE(AVG(g.obtained_grade), 0) AS class_average
      FROM classes c
      JOIN assignments a ON a.class_id = c.class_id ${dateCondition}
      JOIN submissions s ON s.assignment_id = a.assignment_id
      JOIN grades g ON g.submission_id = s.submission_id
      GROUP BY c.subject
    `;
    
    const classAveragesResult = await pool.query(classAveragesQuery);
    const classAverages = {};
    classAveragesResult.rows.forEach(row => {
      classAverages[row.subject] = parseFloat(row.class_average);
    });
    
    return {
      studentPerformance: rows.map(row => ({
        subject: row.subject || row.class_name,
        studentScore: parseFloat(row.average_grade) || 0,
        classAverage: classAverages[row.subject] || classAverages[row.class_name] || 0,
        totalAssignments: parseInt(row.total_assignments) || 0,
        submittedAssignments: parseInt(row.submitted_assignments) || 0
      })),
      summary: {
        overallAverage: rows.length > 0 ? 
          rows.reduce((sum, row) => sum + parseFloat(row.average_grade), 0) / rows.length : 0,
        totalClasses: rows.length,
        completedAssignments: rows.reduce((sum, row) => sum + parseInt(row.submitted_assignments), 0),
        totalAssignments: rows.reduce((sum, row) => sum + parseInt(row.total_assignments), 0)
      }
    };
  } catch (error) {
    console.error('Error in getPerformanceAnalytics:', error);
    throw error;
  }
};


const getRecentTestFeedback = async (student_id, limit = 3) => {
  const query = `
    SELECT 
      g.grade_id,
      g.obtained_grade,
      COALESCE(g.feedback, '') as feedback,
      COALESCE(g.corrections, '') as corrections,
      COALESCE(g.suggestions, '') as suggestions,
      COALESCE(g.weaknesses, '') as weaknesses,
      COALESCE(g.improvementAreas, '') as improvementAreas,
      a.title AS assignment_title,
      COALESCE(a.description, '') AS assignment_description,
      c.class_name,
      c.subject,
      g.submission_id,
      s.submission_date
    FROM grades g
    JOIN submissions s ON s.submission_id = g.submission_id
    JOIN assignments a ON a.assignment_id = s.assignment_id
    JOIN classes c ON c.class_id = a.class_id
    WHERE s.student_id = $1 
      AND (
        g.feedback IS NOT NULL OR 
        g.corrections IS NOT NULL OR 
        g.suggestions IS NOT NULL OR 
        g.weaknesses IS NOT NULL OR 
        g.improvementAreas IS NOT NULL
      )
    ORDER BY s.submission_date DESC
    LIMIT $2
  `;
  
  try {
    const { rows } = await pool.query(query, [student_id, limit]);
    
    return rows.map(row => ({
      grade_id: row.grade_id,
      obtained_grade: row.obtained_grade,
      feedback: row.feedback,
      corrections: row.corrections,
      suggestions: row.suggestions,
      weaknesses: row.weaknesses,
      improvementAreas: row.improvementAreas,
      assignment_title: row.assignment_title,
      assignment_description: row.assignment_description,
      class_name: row.class_name,
      subject: row.subject,
      submission_date: row.submission_date
    }));
  } catch (error) {
    console.error('Error in getRecentTestFeedback:', error);
    throw error;
  }
};

// ================ ASSIGNMENT MODELS ================

// Get all assignments for student with submission status
const getStudentAssignmentsWithStatus = async (student_id) => {
    const query = `
        SELECT 
            c.class_id,
            c.class_name,
            c.subject,
            a.assignment_id,
            a.title,
            a.description,
            a.deadline,
            a.created_date,
            a.points,
            a.evaluation_guideline,
            s.submission_id,
            s.submission_date,
            g.obtained_grade,
            g.feedback
        FROM class_students cs
        JOIN classes c ON c.class_id = cs.class_id
        JOIN assignments a ON a.class_id = c.class_id
        LEFT JOIN submissions s ON s.assignment_id = a.assignment_id AND s.student_id = cs.student_id
        LEFT JOIN grades g ON g.submission_id = s.submission_id
        WHERE cs.student_id = $1
        ORDER BY a.deadline ASC
    `;
    
    try {
        const { rows } = await pool.query(query, [student_id]);
        return rows;
    } catch (error) {
        console.error('Error in getStudentAssignmentsWithStatus:', error);
        throw error;
    }
}

// Get grade by submission ID
const getGradeBySubmissionId = async (submission_id) => {
    const query = `
        SELECT * FROM grades 
        WHERE submission_id = $1
    `;
    
    try {
        const { rows } = await pool.query(query, [submission_id]);
        return rows[0];
    } catch (error) {
        console.error('Error in getGradeBySubmissionId:', error);
        throw error;
    }
}

// Get detailed assignment info
const getAssignmentDetailed = async (assignment_id, student_id) => {
    const assignmentQuery = `
        SELECT 
            a.*,
            c.class_name,
            c.subject,
            t.first_name || ' ' || t.last_name as teacher_name
        FROM assignments a
        JOIN classes c ON c.class_id = a.class_id
        JOIN teachers t ON t.teacher_id = c.teacher_id
        WHERE a.assignment_id = $1
    `;
    
    try {
        const assignmentResult = await pool.query(assignmentQuery, [assignment_id]);
        
        if (assignmentResult.rows.length === 0) {
            throw new Error('Assignment not found');
        }

        const assignment = assignmentResult.rows[0];

        // Get attachments
        const attachmentsQuery = `
            SELECT * FROM assignments_attachments 
            WHERE assignment_id = $1
        `;
        const attachmentsResult = await pool.query(attachmentsQuery, [assignment_id]);
        
        // Get submission
        const submissionQuery = `
            SELECT * FROM submissions 
            WHERE assignment_id = $1 AND student_id = $2
        `;
        const submissionResult = await pool.query(submissionQuery, [assignment_id, student_id]);
        
        // Get grade
        let grade = null;
        if (submissionResult.rows.length > 0) {
            const gradeResult = await pool.query(
                'SELECT * FROM grades WHERE submission_id = $1',
                [submissionResult.rows[0].submission_id]
            );
            grade = gradeResult.rows[0] || null;
        }

        return {
            assignment: assignment,
            attachments: attachmentsResult.rows,
            submission: submissionResult.rows[0] || null,
            grade: grade
        };
    } catch (error) {
        console.error('Error in getAssignmentDetailed:', error);
        throw error;
    }
}
getSubmission_idByStudent_idAndAssignment_id = async (student_id, assignment_id) => {
    const query = `
      SELECT submission_id, student_id, assignment_id
      FROM submissions
      WHERE student_id = $1 AND assignment_id = $2
    `;

    try {
        const { rows } = await pool.query(query, [student_id, assignment_id]);
        console.log("Query executed successfully:", rows);
        return rows[0] ;
    } catch (error) {
        console.error('Error in getSubmission_idByStudent_idAndAssignment_id:', error);
        throw error;
    }
}

// ================ LEADERBOARD MODELS ================

// Get leaderboard data with rankings and badges
const getLeaderboardData = async (class_id = null) => {
    try {
        // Base query for student performance
        let query = `
            SELECT 
                s.student_id,
                s.first_name || ' ' || s.last_name as name,
                s.url_dp as avatar,
                COUNT(DISTINCT a.assignment_id) as total_assignments,
                COUNT(DISTINCT sub.submission_id) as submitted_assignments,
                COALESCE(AVG(g.obtained_grade), 0) as average_grade,
                COUNT(DISTINCT att.attendance_id) as total_classes,
                COUNT(DISTINCT att.attendance_id) FILTER (WHERE att.status = 'Present') as present_classes,
                COALESCE(SUM(g.obtained_grade), 0) as total_points
            FROM students s
            LEFT JOIN class_students cs ON s.student_id = cs.student_id
            LEFT JOIN classes c ON cs.class_id = c.class_id
            LEFT JOIN assignments a ON a.class_id = c.class_id
            LEFT JOIN submissions sub ON sub.assignment_id = a.assignment_id AND sub.student_id = s.student_id
            LEFT JOIN grades g ON g.submission_id = sub.submission_id
            LEFT JOIN attendance att ON att.student_id = s.student_id AND att.class_id = c.class_id
        `;

        const params = [];
        
        if (class_id) {
            query += ` WHERE c.class_id = $1`;
            params.push(class_id);
        }

        query += `
            GROUP BY s.student_id, s.first_name, s.last_name, s.url_dp
            HAVING COUNT(DISTINCT a.assignment_id) > 0 OR COUNT(DISTINCT att.attendance_id) > 0
            ORDER BY total_points DESC, average_grade DESC, present_classes DESC
        `;

        const { rows } = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error in getLeaderboardData:', error);
        throw error;
    }
}

// Calculate badges for students based on performance
const calculateStudentBadges = async (studentData) => {
    const badges = [];

    // Academic performance badges
    if (studentData.average_grade >= 90) {
        badges.push("🏆 Top Performer");
    } else if (studentData.average_grade >= 80) {
        badges.push("📚 Academic Excellence");
    }

    // Consistency badges
    const submissionRate = studentData.total_assignments > 0 
        ? (studentData.submitted_assignments / studentData.total_assignments) * 100 
        : 0;
    
    if (submissionRate >= 95) {
        badges.push("🎯 Consistent Effort");
    } else if (submissionRate >= 80) {
        badges.push("💪 Persistent");
    }

    // Attendance badges
    const attendanceRate = studentData.total_classes > 0 
        ? (studentData.present_classes / studentData.total_classes) * 100 
        : 0;
    
    if (attendanceRate >= 95) {
        badges.push("⏰ Perfect Attendance");
    } else if (attendanceRate >= 90) {
        badges.push("🎓 Diligent Learner");
    }

    // Improvement badges (you might want to track this over time)
    if (studentData.average_grade >= 75 && studentData.average_grade < 85) {
        badges.push("⭐ Rising Star");
    }

    // Participation badges
    if (studentData.submitted_assignments >= 5) {
        badges.push("🤝 Active Participant");
    }

    // Default badge if no others
    if (badges.length === 0 && studentData.submitted_assignments > 0) {
        badges.push("🎒 Learner");
    }

    return badges;
}


// ================ TASK COMPLETION CHART MODELS ================

// Get task completion data for charts
const getTaskCompletionData = async (student_id, period = 'current-month') => {
    try {
        let dateCondition = '';
        let groupBy = 'week';
        
        switch(period) {
            case 'current-week':
                dateCondition = `AND a.created_date >= date_trunc('week', CURRENT_DATE)`;
                groupBy = 'day';
                break;
            case 'last-week':
                dateCondition = `AND a.created_date >= date_trunc('week', CURRENT_DATE - INTERVAL '1 week') 
                               AND a.created_date < date_trunc('week', CURRENT_DATE)`;
                groupBy = 'day';
                break;
            case 'current-month':
                dateCondition = `AND a.created_date >= date_trunc('month', CURRENT_DATE)`;
                groupBy = 'week';
                break;
            case 'last-month':
                dateCondition = `AND a.created_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                               AND a.created_date < date_trunc('month', CURRENT_DATE)`;
                groupBy = 'week';
                break;
            default:
                dateCondition = `AND a.created_date >= date_trunc('month', CURRENT_DATE)`;
        }

        const query = `
            WITH date_series AS (
                SELECT 
                    generate_series(
                        date_trunc($2, CURRENT_DATE - INTERVAL '1 month'),
                        date_trunc($2, CURRENT_DATE),
                        CASE 
                            WHEN $2 = 'week' THEN '1 week'::interval
                            WHEN $2 = 'day' THEN '1 day'::interval
                        END
                    ) as period
            ),
            assignments_created AS (
                SELECT 
                    date_trunc($2, a.created_date) as period,
                    COUNT(*) as created_count
                FROM assignments a
                JOIN class_students cs ON a.class_id = cs.class_id
                WHERE cs.student_id = $1 
                ${dateCondition}
                GROUP BY date_trunc($2, a.created_date)
            ),
            assignments_completed AS (
                SELECT 
                    date_trunc($2, s.submission_date) as period,
                    COUNT(*) as completed_count
                FROM submissions s
                JOIN assignments a ON s.assignment_id = a.assignment_id
                WHERE s.student_id = $1 
                ${dateCondition}
                GROUP BY date_trunc($2, s.submission_date)
            )
            SELECT 
                ds.period,
                TO_CHAR(ds.period, CASE WHEN $2 = 'week' THEN '"Week "WW' ELSE 'Dy DD' END) as label,
                COALESCE(ac.created_count, 0) as tasks_created,
                COALESCE(acomp.completed_count, 0) as tasks_completed
            FROM date_series ds
            LEFT JOIN assignments_created ac ON ds.period = ac.period
            LEFT JOIN assignments_completed acomp ON ds.period = acomp.period
            ORDER BY ds.period
        `;

        const { rows } = await pool.query(query, [student_id, groupBy]);
        return rows;
    } catch (error) {
        console.error('Error in getTaskCompletionData:', error);
        throw error;
    }
}

// Get overall task completion statistics
const getTaskCompletionStats = async (student_id, period = 'current-month') => {
    try {
        let dateCondition = '';
        
        switch(period) {
            case 'current-week':
                dateCondition = `AND a.created_date >= date_trunc('week', CURRENT_DATE)`;
                break;
            case 'last-week':
                dateCondition = `AND a.created_date >= date_trunc('week', CURRENT_DATE - INTERVAL '1 week') 
                               AND a.created_date < date_trunc('week', CURRENT_DATE)`;
                break;
            case 'current-month':
                dateCondition = `AND a.created_date >= date_trunc('month', CURRENT_DATE)`;
                break;
            case 'last-month':
                dateCondition = `AND a.created_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                               AND a.created_date < date_trunc('month', CURRENT_DATE)`;
                break;
            default:
                dateCondition = `AND a.created_date >= date_trunc('month', CURRENT_DATE)`;
        }

        const query = `
            SELECT 
                COUNT(DISTINCT a.assignment_id) as total_tasks,
                COUNT(DISTINCT s.submission_id) as completed_tasks,
                COUNT(DISTINCT a.assignment_id) - COUNT(DISTINCT s.submission_id) as pending_tasks,
                CASE 
                    WHEN COUNT(DISTINCT a.assignment_id) > 0 
                    THEN ROUND((COUNT(DISTINCT s.submission_id) * 100.0 / COUNT(DISTINCT a.assignment_id)), 1)
                    ELSE 0 
                END as completion_rate,
                AVG(g.obtained_grade) as average_grade
            FROM class_students cs
            JOIN assignments a ON a.class_id = cs.class_id
            LEFT JOIN submissions s ON s.assignment_id = a.assignment_id AND s.student_id = cs.student_id
            LEFT JOIN grades g ON g.submission_id = s.submission_id
            WHERE cs.student_id = $1 
            ${dateCondition}
        `;

        const { rows } = await pool.query(query, [student_id]);
        return rows[0] || {};
    } catch (error) {
        console.error('Error in getTaskCompletionStats:', error);
        throw error;
    }
}


module.exports = {
  createStudent,
  
  getStudentByEmail,
  getClass_idByStudent_id,
  getStudentsByClass_id,
  getClassInfoByStudentId,
  getSubmissionsByAssigment_idAndStudent_id,
  getStudentByStudent_id,
  getGradesBySubmissionByStudent_idAndAssignment_id,
  getSubmission_idByStudent_idAndAssignment_id,

  //attendance

 
  getClassesWithAttendanceByStudentId,
  getAttendanceByStudentAndClass,

  //analytics
  getOverallAttendanceAnalytics,
  getPerformanceAnalytics,
  getRecentTestFeedback,
  getStudentAssignmentsWithStatus,
  getGradeBySubmissionId,
  getAssignmentDetailed,
  getLeaderboardData,
  calculateStudentBadges,
  getTaskCompletionData,
  getTaskCompletionStats,

  // Biometric
  markAttendanceForSession,
  getActiveSessionByClassId

};

