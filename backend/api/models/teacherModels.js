const { pool, bcrypt } = require('./database')

//////////////////PUT MODELS/////////////////

createTeacher = async (teacherData) => {
  const { first_name, last_name, email, password } = teacherData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO teachers (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [first_name, last_name, email, hashedPassword];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
}

//Attendence From teacher side

// createAttendance = async(class_id , student_id  , status )=>{
//   const query = `
//     INSERT INTO attendance(class_id, student_id, status)
//     VALUES ($1, $2, $3)
//     ON CONFLICT (class_id, student_id, date, lecture_number)
//     DO UPDATE SET status = EXCLUDED.status
//   `;

//   const values = [class_id, student_id, status];


//   try{
//     await pool.query(query,values);
//   }catch(error){
//     console.error('Error creating student Attendance:', error);
//     throw error;
//   }

// }

// createAttendance = async (class_id, student_id, status,  unique_id, method = "manual") => {
// const query = `
//   INSERT INTO attendance (class_id, student_id, status, method, unique_id)
//   VALUES ($1, $2, $3, $4, $5)
//   ON CONFLICT (class_id, student_id, date, lecture_number, session_id)
//   DO UPDATE SET status = EXCLUDED.status, method = EXCLUDED.method
// `;

// const values = [class_id, student_id, status, method, unique_id];
// console.log("Attendance Query Values:", values);
//   try {
//     await pool.query(query, values);
//   } catch (error) {
//     console.error('Error creating student Attendance:', error);
//     throw error;
//   }
// };

createAttendance = async (class_id, student_id, status, unique_id, lecture_number, session_id = null, method = "manual") => {
  const query = `
    INSERT INTO attendance (class_id, student_id, status, method, unique_id, lecture_number, session_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (class_id, student_id, date, lecture_number)
    DO UPDATE SET status = EXCLUDED.status, method = EXCLUDED.method
  `;

  const values = [class_id, student_id, status, method, unique_id, lecture_number, session_id];
  console.log("Attendance Query Values:", values);

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error('Error creating student Attendance:', error);
    throw error;
  }
};


/////////////////////////////////////////////////
///// Biometric Attendance session creation//////
/////////////////////////////////////////////////
const startAttendanceSession = async (class_id, teacher_id) => {
  try {
    // Deactivate any previous active sessions for this class
    await pool.query(
      "UPDATE attendance_sessions SET is_active = FALSE WHERE class_id = $1",
      [class_id]
    );

    // Create a new active session
    const result = await pool.query(
      `INSERT INTO attendance_sessions (class_id, teacher_id, is_active, start_time)
       VALUES ($1, $2, TRUE, CURRENT_TIME)
       RETURNING *`,
      [class_id, teacher_id]
    );

    return result.rows[0]; // Return the newly created session
  } catch (error) {
    console.error("Error starting attendance session:", error);
    throw error;
  }
};

const endAttendanceSession = async (class_id) => {
  const query = `
    UPDATE attendance_sessions
    SET end_time = NOW(), is_active = false
    WHERE class_id = $1 AND is_active = true
    RETURNING *;
  `;
  const result = await pool.query(query, [class_id]);
  return result.rows[0];
};


// ==========Model for Getting class detail by class Id==========
async function getClassById(class_id) {
  const query = `SELECT class_id, class_name FROM classes WHERE class_id = $1`;
  const result = await pool.query(query, [class_id]);
  return result.rows[0]; // return the first (and only) matching row
}


//////////////////GET MODELS/////////////////

getTeacherByEmail = async (email) => {
  const query = 'SELECT * FROM teachers WHERE email = $1';
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching teacher by email:', error);
    throw error;
  }
}

getContext = async (assignment_id) => {
  const query =
    `  
    SELECT 
    a.title,
    a.description,
    a.evaluation_guideline,
    a.points,
    json_agg(aa.file_link) AS file_link_json
  FROM 
    assignments a 
  LEFT JOIN 
    assignments_attachments aa ON a.assignment_id = aa.assignment_id
  WHERE
      a.assignment_id = $1
  GROUP BY
      a.assignment_id;
  
  `;
  try {
    const result = await pool.query(query, [assignment_id]);
    console.log("result.rows[0]", result.rows[0])
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching getContext:', error);
    throw error;
  }

}

//Attendance

getAttendanceOfClassByClassId = async (class_id) => {
  // result = 
  //   [
  //   {
  //     "date": "2025-09-18",
  //     "class_id": 101,
  //     "lecture_number": 1,
  //     "first_marked_time": "09:00:00",
  //     "percentage_present": 95.00
  //   },
  //   {
  //     "date": "2025-09-18",
  //     "class_id": 101,
  //     "lecture_number": 2,
  //     "first_marked_time": "14:00:00",
  //     "percentage_present": 88.00
  //   }
  // ]

  const query = `
SELECT
  class_id,
  date,
  
  MIN(time_marked) AS first_marked_time,
  ROUND(
    (SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END)::decimal 
     / COUNT(*)::decimal) * 100,
    2
  ) AS percentage_present
FROM attendance
WHERE class_id = $1
GROUP BY class_id, date ,unique_id
ORDER BY date;
  
  `
  try {
    const result = await pool.query(query, [class_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching getContext:', error);
    throw error;
  }


}


// ================ TEACHER ANALYTICS MODELS ================

// Get classroom overview statistics for teacher
getTeacherClassroomOverview = async (teacher_id) => {
  try {
    const query = `
            WITH class_stats AS (
                SELECT 
                    c.class_id,
                    COUNT(DISTINCT cs.student_id) as student_count,
                    COUNT(DISTINCT a.assignment_id) as total_assignments,
                    COUNT(DISTINCT s.submission_id) as submitted_assignments,
                    COUNT(DISTINCT att.attendance_id) as total_attendance_records,
                    COUNT(DISTINCT att.attendance_id) FILTER (WHERE att.status = 'Present') as present_records,
                    COALESCE(AVG(g.obtained_grade), 0) as avg_grade
                FROM classes c
                LEFT JOIN class_students cs ON c.class_id = cs.class_id
                LEFT JOIN assignments a ON a.class_id = c.class_id
                LEFT JOIN submissions s ON s.assignment_id = a.assignment_id
                LEFT JOIN grades g ON g.submission_id = s.submission_id
                LEFT JOIN attendance att ON att.class_id = c.class_id AND att.student_id = cs.student_id
                WHERE c.teacher_id = $1
                GROUP BY c.class_id
            )
            SELECT 
                COUNT(DISTINCT class_id) as total_classes,
                SUM(student_count) as total_students,
                CASE 
                    WHEN SUM(total_assignments) > 0 
                    THEN ROUND((SUM(submitted_assignments) * 100.0 / SUM(total_assignments)), 1)
                    ELSE 0 
                END as avg_class_performance,
                CASE 
                    WHEN SUM(total_assignments) > 0 
                    THEN ROUND(((SUM(total_assignments) - SUM(submitted_assignments)) * 100.0 / SUM(total_assignments)), 1)
                    ELSE 0 
                END as pending_assignments_rate,
                CASE 
                    WHEN SUM(total_attendance_records) > 0 
                    THEN ROUND((SUM(present_records) * 100.0 / SUM(total_attendance_records)), 1)
                    ELSE 0 
                END as attendance_rate,
                ROUND(AVG(avg_grade)::numeric, 1) as overall_avg_grade
            FROM class_stats
        `;

    const { rows } = await pool.query(query, [teacher_id]);
    return rows[0] || {
      total_classes: 0,
      total_students: 0,
      avg_class_performance: 0,
      pending_assignments_rate: 0,
      attendance_rate: 0,
      overall_avg_grade: 0
    };
  } catch (error) {
    console.error('Error in getTeacherClassroomOverview:', error);
    throw error;
  }
}

// Get detailed class statistics for teacher
getTeacherClassStatistics = async (teacher_id) => {
  try {
    const query = `
            SELECT 
                c.class_id,
                c.class_name,
                c.subject,
                COUNT(DISTINCT cs.student_id) as student_count,
                COUNT(DISTINCT a.assignment_id) as total_assignments,
                COUNT(DISTINCT s.submission_id) as submitted_assignments,
                COUNT(DISTINCT att.attendance_id) as total_attendance_records,
                COUNT(DISTINCT att.attendance_id) FILTER (WHERE att.status = 'Present') as present_records,
                COALESCE(AVG(g.obtained_grade), 0) as avg_grade,
                CASE 
                    WHEN COUNT(DISTINCT a.assignment_id) > 0 
                    THEN ROUND((COUNT(DISTINCT s.submission_id) * 100.0 / COUNT(DISTINCT a.assignment_id)), 1)
                    ELSE 0 
                END as completion_rate,
                CASE 
                    WHEN COUNT(DISTINCT att.attendance_id) > 0 
                    THEN ROUND((COUNT(DISTINCT att.attendance_id) FILTER (WHERE att.status = 'Present') * 100.0 / COUNT(DISTINCT att.attendance_id)), 1)
                    ELSE 0 
                END as class_attendance_rate
            FROM classes c
            LEFT JOIN class_students cs ON c.class_id = cs.class_id
            LEFT JOIN assignments a ON a.class_id = c.class_id
            LEFT JOIN submissions s ON s.assignment_id = a.assignment_id
            LEFT JOIN grades g ON g.submission_id = s.submission_id
            LEFT JOIN attendance att ON att.class_id = c.class_id AND att.student_id = cs.student_id
            WHERE c.teacher_id = $1
            GROUP BY c.class_id, c.class_name, c.subject
            ORDER BY c.class_name
        `;

    const { rows } = await pool.query(query, [teacher_id]);
    return rows;
  } catch (error) {
    console.error('Error in getTeacherClassStatistics:', error);
    throw error;
  }
}

// ================ TEACHER FEEDBACK MODELS ================

// Get class feedback summary for teacher
getTeacherClassFeedbackSummary = async (teacher_id) => {
  try {
    const query = `
            SELECT 
                c.class_id, 
                c.class_name,
                c.subject,
                COUNT(DISTINCT s.student_id) as total_students,
                COUNT(DISTINCT sub.submission_id) as total_submissions,
                COUNT(DISTINCT g.grade_id) as graded_submissions,
                COUNT(DISTINCT g.grade_id) FILTER (WHERE g.feedback IS NOT NULL OR g.suggestions IS NOT NULL) as feedback_count,
                ROUND(AVG(g.obtained_grade)::numeric, 1) as avg_grade,
                STRING_AGG(DISTINCT 
                    CASE 
                        WHEN g.weaknesses IS NOT NULL AND g.weaknesses != '' THEN g.weaknesses
                        ELSE NULL
                    END, ' . '
                ) as common_weaknesses,
                STRING_AGG(DISTINCT 
                    CASE 
                        WHEN g.improvementAreas IS NOT NULL AND g.improvementAreas != '' THEN g.improvementAreas
                        ELSE NULL
                    END, ' . '
                ) as improvement_areas
            FROM classes c
            LEFT JOIN assignments a ON a.class_id = c.class_id
            LEFT JOIN submissions sub ON sub.assignment_id = a.assignment_id
            LEFT JOIN grades g ON g.submission_id = sub.submission_id
            LEFT JOIN students s ON sub.student_id = s.student_id
            WHERE c.teacher_id = $1
            GROUP BY c.class_id, c.class_name, c.subject
            HAVING COUNT(DISTINCT sub.submission_id) > 0
            ORDER BY c.class_name
        `;

    const { rows } = await pool.query(query, [teacher_id]);
    return rows;
  } catch (error) {
    console.error('Error in getTeacherClassFeedbackSummary:', error);
    throw error;
  }
}

// Get detailed feedback for a specific class
getClassDetailedFeedback = async (class_id) => {
  try {
    const query = `
            SELECT 
                g.grade_id,
                g.obtained_grade,
                COALESCE(g.feedback, 'No feedback provided') as feedback,
                COALESCE(g.corrections, 'No corrections noted') as corrections,
                COALESCE(g.suggestions, 'No suggestions provided') as suggestions,
                COALESCE(g.weaknesses, 'No weaknesses identified') as weaknesses,
                COALESCE(g.improvementAreas, 'No improvement areas specified') as improvementAreas,
                a.title as assignment_title,
                a.description as assignment_description,
                a.points as max_points,
                s.student_id,
                stu.first_name || ' ' || stu.last_name as student_name,
                sub.submission_date
            FROM classes c
            JOIN assignments a ON a.class_id = c.class_id
            JOIN submissions sub ON sub.assignment_id = a.assignment_id
            JOIN students stu ON sub.student_id = stu.student_id
            LEFT JOIN grades g ON g.submission_id = sub.submission_id
            WHERE c.class_id = $1 
            AND (g.feedback IS NOT NULL OR g.suggestions IS NOT NULL OR g.weaknesses IS NOT NULL)
            ORDER BY sub.submission_date DESC, stu.first_name
        `;

    const { rows } = await pool.query(query, [class_id]);
    return rows;
  } catch (error) {
    console.error('Error in getClassDetailedFeedback:', error);
    throw error;
  }
}

// Get common issues across all classes for teacher
getTeacherCommonIssues = async (teacher_id) => {
  try {
    const query = `
            WITH feedback_analysis AS (
                SELECT 
                    c.class_name,
                    c.subject,
                    COUNT(*) as total_feedbacks,
                    COUNT(CASE WHEN g.weaknesses IS NOT NULL AND g.weaknesses != '' THEN 1 END) as weaknesses_count,
                    COUNT(CASE WHEN g.improvementAreas IS NOT NULL AND g.improvementAreas != '' THEN 1 END) as improvement_count,
                    STRING_AGG(DISTINCT 
                        CASE 
                            WHEN g.weaknesses IS NOT NULL AND g.weaknesses != '' THEN g.weaknesses
                            ELSE NULL
                        END, ' . '
                    ) as all_weaknesses,
                    STRING_AGG(DISTINCT 
                        CASE 
                            WHEN g.improvementAreas IS NOT NULL AND g.improvementAreas != '' THEN g.improvementAreas
                            ELSE NULL
                        END, ' . '
                    ) as all_improvements
                FROM classes c
                JOIN assignments a ON a.class_id = c.class_id
                JOIN submissions sub ON sub.assignment_id = a.assignment_id
                JOIN grades g ON g.submission_id = sub.submission_id
                WHERE c.teacher_id = $1
                AND (g.feedback IS NOT NULL OR g.suggestions IS NOT NULL OR g.weaknesses IS NOT NULL)
                GROUP BY c.class_id, c.class_name, c.subject
            )
            SELECT 
                class_name,
                subject,
                total_feedbacks,
                weaknesses_count,
                improvement_count,
                all_weaknesses,
                all_improvements
            FROM feedback_analysis
            ORDER BY total_feedbacks DESC
        `;

    const { rows } = await pool.query(query, [teacher_id]);
    return rows;
  } catch (error) {
    console.error('Error in getTeacherCommonIssues:', error);
    throw error;
  }
}




module.exports = {
  createTeacher,
  createAttendance,
  getClassById,
  // biometric
  startAttendanceSession,
  endAttendanceSession,

  //ANALYTICS
  getTeacherClassroomOverview,
  getTeacherClassStatistics,
  getTeacherClassFeedbackSummary,
  getClassDetailedFeedback,
  getTeacherCommonIssues,

  getTeacherByEmail,
  getContext,
  getAttendanceOfClassByClassId
}