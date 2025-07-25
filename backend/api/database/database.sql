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

-- ================================
-- 1️⃣ Teachers table
-- ================================
CREATE TABLE teachers (
  teacher_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- store hashed password
  url_dp VARCHAR(255) DEFAULT 'public/img/user_photo'
);

-- ================================
-- 2️⃣ Students table
-- ================================
CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  url_dp VARCHAR(255) DEFAULT 'public/img/user_photo'
);

-- ================================
-- 3️⃣ Classes table
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
-- 4️⃣ Class-Students mapping (M:N)
-- ================================
CREATE TABLE class_students (
  class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, student_id)
);

-- ================================
-- 5️⃣ Assignments table
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
-- 6️⃣ Submissions table
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
-- 7️⃣ Grades table
-- ================================
CREATE TABLE grades (
  grade_id SERIAL PRIMARY KEY,
  obtained_grade INTEGER DEFAULT NULL,
  student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
  -- assignment_id INTEGER REFERENCES assignments(assignment_id) ON DELETE CASCADE,
  feedback VARCHAR(25500) DEFAULT NULL,
  submission_id INTEGER REFERENCES submissions(submission_id) ON DELETE CASCADE
);
