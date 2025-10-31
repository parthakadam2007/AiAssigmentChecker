-- ================================
-- DROP EXISTING TABLES (safe reset)
-- ================================
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS class_students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS assignments_attachments CASCADE;
DROP TABLE IF EXISTS attendance;
-- ================================
-- Teachers table
-- ================================
CREATE TABLE teachers (
  teacher_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, 
  url_dp VARCHAR(255) DEFAULT 'public/img/user_photo'
);

-- ================================
--  Students table
-- ================================
CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  url_dp VARCHAR(255) DEFAULT 'public/img/user_photo',
  face_embedding TEXT NULL  -- New column for face embedding
);

-- ================================
--  Classes table
-- ================================
CREATE TABLE classes (
  class_id SERIAL PRIMARY KEY,
  class_name VARCHAR(100) NOT NULL,
  section VARCHAR(50) DEFAULT NULL,
  subject VARCHAR(100) DEFAULT NULL,
  room VARCHAR(50) DEFAULT NULL,
  description VARCHAR(255) DEFAULT 'no description',
  joining_code VARCHAR(50) UNIQUE NOT NULL,
  uploaded_photo_url VARCHAR(255) DEFAULT 'public/img/class_photo',
  teacher_id INTEGER REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- ================================
-- Class-Students mapping (M:N)
-- ================================
CREATE TABLE class_students (
  class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, student_id)
);

-- ================================
--  Assignments table
-- ================================
CREATE TABLE assignments (
  assignment_id SERIAL PRIMARY KEY,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline TIMESTAMP DEFAULT NULL,
  evaluation_guideline TEXT DEFAULT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(2550) DEFAULT 'no description',
  points INTEGER DEFAULT NULL,
  class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE
);

CREATE TABLE assignments_attachments (
  upload_id SERIAL PRIMARY KEY,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_link TEXT DEFAULT NULL,
  file_original_name TEXT DEFAULT NULL,
  assignment_id INTEGER REFERENCES assignments(assignment_id) ON DELETE CASCADE
);

-- ================================
--  Submissions table
-- ================================
CREATE TABLE submissions (
  submission_id SERIAL PRIMARY KEY,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_link  TEXT DEFAULT NULL,
  file_original_name TEXT DEFAULT NULL,
  student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
  assignment_id INTEGER REFERENCES assignments(assignment_id) ON DELETE CASCADE
);



-- ================================
--  Grades table
-- ================================
CREATE TABLE grades (
  grade_id SERIAL PRIMARY KEY,
  obtained_grade INTEGER DEFAULT NULL,
  student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
feedback TEXT DEFAULT NULL,
corrections TEXT DEFAULT NULL,
suggestions TEXT DEFAULT NULL,
weaknesses TEXT DEFAULT NULL,
improvementAreas TEXT DEFAULT NULL,
  submission_id INTEGER REFERENCES submissions(submission_id) ON DELETE CASCADE
);  
ALTER TABLE grades
ADD COLUMN aiTextDetection TEXT DEFAULT NULL,
ADD COLUMN plagiarism TEXT DEFAULT NULL;

-- ================================
-- Attendance table
-- ================================
CREATE TABLE attendance (
  attendance_id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  lecture_number INTEGER,
  time_marked TIME DEFAULT CURRENT_TIME,
  unique_id VARCHAR(100) DEFAULT,
  session_id INTEGER DEFAULT NULL,
  method VARCHAR(20) DEFAULT 'manual' ,
  status VARCHAR(20) DEFAULT 'Absent' CHECK (status IN ('Present', 'Absent')),
  UNIQUE (class_id, student_id, date,lecture_number)
);



CREATE TABLE attendance_sessions (
    session_id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    start_time TIME,
    end_time TIME,
    is_active BOOLEAN DEFAULT FALSE
);


-- ================================
-- Alert table
-- ================================
CREATE TABLE alerts (
  alert_id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  teacher_id INT REFERENCES teachers(teacher_id),
  class_id INT REFERENCES classes(class_id),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
---

CREATE OR REPLACE FUNCTION set_lecture_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Find max lecture_number for same class & date
  SELECT COALESCE(MAX(lecture_number), 0) + 1
  INTO NEW.lecture_number
  FROM attendance
  WHERE class_id = NEW.class_id
    AND date = NEW.date;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_lecture_number
BEFORE INSERT ON attendance
FOR EACH ROW
WHEN (NEW.lecture_number IS NULL)
EXECUTE FUNCTION set_lecture_number();
---

-- Face Data for Biometric Attendance
CREATE TABLE face_data (
  face_id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
  encoding BYTEA NOT NULL,        -- store the face embedding (128D vector as bytes)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


