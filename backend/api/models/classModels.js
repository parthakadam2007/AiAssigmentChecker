const { pool } = require('./database')
const Redis = require('ioredis')
///////////////////////// CREATE MODELS //////////////////////
createClass = async (classData, res) => {
  const {
    class_name,
    section,
    subject,
    room,
    description,
    uploaded_photo_url,
    teacher_id
  } = classData;

  // Generate joining code
  const joining_code = Math.random().toString(36).substring(2, 10);

  if (!teacher_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const query = `
    INSERT INTO classes (
      class_name, section, subject, room, description, joining_code, uploaded_photo_url, teacher_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    class_name ?? null,
    section ?? null,
    subject ?? null,
    room ?? null,
    description ?? null,
    joining_code,
    uploaded_photo_url ?? null,
    teacher_id
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

studentClass = async (classData, res) => {
  const { class_id, student_id } = classData;

  if (!class_id || !student_id) {
    return res.status(400).json({ error: 'Class ID and Student ID are required' });
  }


  const query = `
    INSERT INTO class_students (class_id, student_id)
    VALUES ($1, $2)
    RETURNING *
  `;

  const values = [class_id, student_id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error enrolling student in class:', error);
    throw error;
  }
};

joinClass = async (joining_code, student_id) => {
  // Find class_id from joining_code
  const classQuery = `
    SELECT class_id FROM classes WHERE joining_code = $1
  `;
  const classResult = await pool.query(classQuery, [joining_code]);
  if (classResult.rows.length === 0) {
    throw new Error('Invalid joining code');
  }
  const class_id = classResult.rows[0].class_id;

  const query = `
    INSERT INTO class_students (class_id, student_id)
    VALUES ($1, $2)
    RETURNING *
  `;

  const values = [class_id, student_id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error enrolling student in class:', error);
    throw error;
  }
};

submissionUpload = async (fileData) => {
  const { file_link, file_original_name, student_id, assignment_id } = fileData;

  const query = `
    INSERT INTO submissions (
      file_link, file_original_name, student_id, assignment_id
    ) VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    file_link,
    file_original_name,
    student_id,
    assignment_id
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error uploading assignment files:', error);
    throw error;
  }
};

createAssigment = async (assignmentData) => {
  const {
    deadline,
    evaluation_guideline,
    title,
    description,
    points,
    class_id,
  } = assignmentData;
  if (!class_id && !title) {
    throw new Error('Class ID and Title are required');
  }

  const query = `
    INSERT INTO assignments (
      deadline, evaluation_guideline, title, description, points, class_id
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    deadline ?? null,
    evaluation_guideline ?? null,
    title,
    description ?? null,
    points ?? null,
    class_id
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

createAssignments_attachments = async (attachmentData) => {
  const { file_link, file_original_name, assignment_id } = attachmentData;

  const query = `
    INSERT INTO assignments_attachments (
      file_link, file_original_name, assignment_id
    ) VALUES ($1, $2, $3)
    RETURNING *
  `;

  const values = [
    file_link,
    file_original_name,
    assignment_id
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating assignment attachment:', error);
    throw error;
  }
}


// | [
// -- api-1       |   {
// -- api-1       |     file_link: 'files-1752915371760-879088583.docx',
// -- api-1       |     student_id: 3,
// -- api-1       |     submission_id: 107,
// -- api-1       |     evaluation_guideline: null
// -- api-1       |   }
// -- api-1       | ]

createGrade = async (evaluationData) => {
  const { obtained_grade, student_id, feedback, submission_id } = evaluationData;
  const query = `
    INSERT INTO grades (
       obtained_grade, student_id, feedback,corrections,suggestions,weaknesses,improvementAreas, submission_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    obtained_grade,
    student_id,
    feedback,
    corrections,
    suggestions,
    weaknesses,
    improvementAreas,
    submission_id
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating evaluation:', error);
    throw error;
  }
}


///////////////////////////GET MODLELS///////////////////////////

getClassByTeacher_id = async (teacher_id) => {
  const query = `
    SELECT * FROM classes WHERE teacher_id = $1
  `;

  try {
    const result = await pool.query(query, [teacher_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching classes by teacher ID:', error);
    throw error;
  }
}

getClassInfoByClass_id = async (class_id) => {
  const query = `
    SELECT * FROM classes WHERE class_id = $1
  `;

  try {
    const result = await pool.query(query, [class_id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching class info by class ID:', error);
    throw error;
  }
}


getAssignmentsByClass_id = async (class_id) => {
  const query = `
    SELECT * FROM assignments WHERE class_id = $1
  `;

  try {
    const result = await pool.query(query, [class_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching assignments by class ID:', error);
    throw error;
  }
}
getAssignments_attachmentsByAssignment_id = async (assignment_id) => {
  const query = `
    SELECT * FROM assignments_attachments WHERE assignment_id = $1
  `;

  try {
    const result = await pool.query(query, [assignment_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching assignment attachments:', error);
    throw error;
  }
}
getAssignmentInfoByAssignment_id = async (assignment_id) => {
  const query = `
    SELECT * FROM assignments WHERE assignment_id = $1
  `;

  try {
    const result = await pool.query(query, [assignment_id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching assignment info:', error);
    throw error;
  }
}

getSubmissionsByAssignment_id = async (assignment_id) => {
  const query = `
    SELECT * FROM submissions WHERE assignment_id = $1
  `;

  try {
    const result = await pool.query(query, [assignment_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching submissions by assignment ID:', error);
    throw error;
  }
}

getGradesByStudent_id = async (student_id) => {
  const query = `
    SELECT * FROM grades WHERE student_id = $1
  `;

  try {
    const result = await pool.query(query, [student_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching grades by student ID:', error);
    throw error;
  }
}

getGradesByAssignment_id = async (assignment_id) => {
  const query = `
    SELECT * FROM grades WHERE assignment_id = $1
  `;

  try {
    const result = await pool.query(query, [assignment_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching grades by assignment ID:', error);
    throw error;
  }
}


getSubmissionAndEvaluation = async (submission_id) => {
  const query = `
SELECT submissions.assignment_id,file_link,student_id,submission_id,evaluation_guideline
FROM submissions
INNER JOIN assignments ON submissions.assignment_id = assignments.assignment_id
WHERE submissions.submission_id = $1
  `

  try {
    const result = await pool.query(query, [submission_id]);
    return result.rows;

  } catch (error) {
    console.error('Error  getSubmissionAndEvaluation:', error);
    throw error;
  }

}

getJsonBuildObjectSubmission = async (class_id) => {
  const query = `
WITH student_list AS (
  SELECT s.student_id, s.first_name, s.last_name
  FROM students s
  JOIN class_students cs ON cs.student_id = s.student_id
  WHERE cs.class_id = $1
),
assignment_list AS (
  SELECT a.assignment_id, a.title, a.deadline, a.points
  FROM assignments a
  WHERE a.class_id = $1
),
grade_data AS (
  SELECT 
    s.student_id,
    a.assignment_id,
    g.obtained_grade,
    CASE 
      WHEN g.obtained_grade IS NOT NULL THEN 'Submitted'
      WHEN sub.submission_id IS NOT NULL THEN 'Pending Grade'
      ELSE 'Not Submitted'
    END AS status
  FROM student_list s
  CROSS JOIN assignment_list a
  LEFT JOIN submissions sub 
    ON sub.assignment_id = a.assignment_id AND sub.student_id = s.student_id
  LEFT JOIN grades g 
    ON g.submission_id = sub.submission_id
)

-- 🧾 Final JSON Structure
SELECT json_build_object(
  'students', (SELECT json_agg(student_list) FROM student_list),
  'assignments', (SELECT json_agg(assignment_list) FROM assignment_list),
  'grades', (SELECT json_agg(grade_data) FROM grade_data)
) AS gradebook_json
  `

  try {
    const result = await pool.query(query, [class_id]);
    return result.rows;

  } catch (error) {
    console.error('Error  getJsonBuildObjectSubmission:', error);
    throw error;
  }


};




getJsonBuildObjectStudentSubmission = async (class_id, student_id) => {
  const query = `
  SELECT
    a.assignment_id,
    a.title,
    a.deadline AS dueDate,
    a.description,
    a.points,
    c.class_name,
    s.submission_id,
    COUNT(aa.upload_id) AS attachmentCount,
    CASE
        WHEN COUNT(aa.upload_id) > 0 THEN TRUE
        ELSE FALSE
    END AS hasAttachment,
    CASE
        WHEN g.obtained_grade IS NOT NULL THEN
            CAST(g.obtained_grade AS VARCHAR) || '/' || CAST(a.points AS VARCHAR)
        WHEN s.submission_id IS NOT NULL THEN
            'Submitted'
        WHEN a.deadline IS NOT NULL AND a.deadline < CURRENT_TIMESTAMP THEN
            'Overdue'
        ELSE
            'Assigned'
    END AS status
FROM
    students AS st
JOIN
    class_students AS cs ON st.student_id = cs.student_id
JOIN
    classes AS c ON cs.class_id = c.class_id
JOIN
    assignments AS a ON c.class_id = a.class_id
LEFT JOIN
    assignments_attachments AS aa ON a.assignment_id = aa.assignment_id
LEFT JOIN
    submissions AS s ON a.assignment_id = s.assignment_id AND st.student_id = s.student_id
LEFT JOIN
    grades AS g ON s.submission_id = g.submission_id
WHERE
    st.student_id = $1
    AND c.class_id = $2 -- <--- NEW: Filter by class_id
GROUP BY
    a.assignment_id,
    a.title,
    a.deadline,
    a.description,
    a.points,
    c.class_name,
    s.submission_id,
    g.obtained_grade
ORDER BY
    a.deadline ASC NULLS LAST,
    a.created_date DESC;
  `;

  try {
    // Pass both student_id and class_id as parameters in the correct order
    const result = await pool.query(query, [student_id, class_id]);
    return result.rows;

  } catch (error) {
    console.error('Error getJsonBuildObjectStudentSubmission:', error);
    throw error;
  }
};
getJsonAssignmentCheckInfo = async (student_id, submission_id) => {
  const query = `
    SELECT 
      g.grade_id,
      g.obtained_grade,
      g.feedback,
      g.submission_id,
      g.student_id AS grade_student_id,

      s.submission_date,
      s.file_link,
      s.file_original_name,
      s.student_id AS submission_student_id,
      s.assignment_id,

      st.first_name,
      st.last_name

    FROM grades g
    JOIN submissions s ON g.submission_id = s.submission_id
    JOIN students st ON s.student_id = st.student_id
    WHERE s.student_id = $1 AND s.submission_id = $2
  `;

  try {
    const result = await pool.query(query, [student_id, submission_id]);
    return result.rows;
  } catch (error) {
    console.error('Error getJsonAssignmentCheckInfo:', error);
    throw error;
  }
};

const getStudentsByClassId = async (classId) => {
  try {
    const query = `
      SELECT s.student_id, s.first_name, s.last_name, s.email, s.phone
      FROM students s
      INNER JOIN class_students cs ON s.student_id = cs.student_id
      WHERE cs.class_id = $1
    `;
    const result = await pool.query(query, [classId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get students by teacher ID (all classes)
const getStudentsByTeacherId = async (teacherId) => {
  try {
    const query = `
      SELECT DISTINCT s.student_id, s.first_name, s.last_name, s.email, s.phone
      FROM students s
      INNER JOIN class_students cs ON s.student_id = cs.student_id
      INNER JOIN classes c ON cs.class_id = c.class_id
      WHERE c.teacher_id = $1
    `;
    const result = await pool.query(query, [teacherId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get classes by teacher ID
const getClassesByTeacherId = async (teacherId) => {
  try {
    const query = `
      SELECT class_id, class_name, section, subject, room
      FROM classes
      WHERE teacher_id = $1
    `;
    const result = await pool.query(query, [teacherId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  createClass,
  studentClass,
  joinClass,
  submissionUpload,
  createAssigment,
  createAssignments_attachments,
  createGrade,

  getClassByTeacher_id,
  getClassInfoByClass_id,
  getAssignmentsByClass_id,
  getAssignments_attachmentsByAssignment_id,
  getAssignmentInfoByAssignment_id,
  getSubmissionsByAssignment_id,
  getGradesByAssignment_id,
  getGradesByStudent_id,
  getSubmissionAndEvaluation,
  getJsonBuildObjectSubmission,
  getJsonBuildObjectStudentSubmission,
  getJsonAssignmentCheckInfo,
  getStudentsByClassId,
  getStudentsByTeacherId,
  getClassesByTeacherId

};

