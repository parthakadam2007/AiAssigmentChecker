///////////////////PUT Endpoints///////////////////////////////
const {studentClass,submissionUpload,createAssignments_attachments,createAssigment} = require('../models/classModels')
const upload= require('../services/myMulter')
handleJoinClasses = async (req, res) => {
  try {
    const classData = req.body;
    const studentId = req.user.student_id; // Assuming user info is attached to request by auth middleware
    if (!studentId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const newClass = await studentClass({ ...classData, student_id: studentId });
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error joining class:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



handleSubmissionUpload = async (req, res) => {
  const files = req.files
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  for (const file of files) {
    await submissionUpload({
      file_link:file.filename, 
      file_original_name:file.originalname, 
      student_id: req.user.student_id, 
      assignment_id: req.params.assignment_id
    });
  }

  res.json({
    message: 'Files uploaded successfully!',
    files: req.files 
  });
}

handleCreateAssigment = async(req,res)=>{
  const newAssignment  = await createAssigment(req.body);
  res.status(201).json(newAssignment);
  if (!newAssignment) {
    return res.status(400).json({ error: 'Failed to create assignment' });
  }
}

handleAssigmnets_attachments = async(req,res)=>{
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }


  for (const file of files) {
    await createAssignments_attachments({
      file_link:file.filename, 
      file_original_name:file.originalname, 
      assignment_id: req.params.assignment_id
    });
  }

  res.json({
    message: 'Files uploaded successfully!',
    files: req.files 
  });
}

/////////////////GET Endpoints///////////////////////////////

const {getClassByTeacher_id,getAssignmentsByClass_id,getAssignments_attachmentsByAssignment_id,getSubmissionsByAssignment_id,getGradesByAssignment_id,getGradesByStudent_id} =require('../models/classModels');

// handleGetClassByTeacher_id = async(req,res)=>{
//   const teacher_id = req.user.teacher_id; // Assuming user info is attached to request by auth middleware
//   if (!teacher_id) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const classes = await getClassByTeacher_id(teacher_id);
//   res.json(classes);
// }

handleGetAssignmentsByClass_id = async(req,res)=>{
  const class_id = req.params.class_id;
  if (!class_id) {
    return res.status(400).json({ error: 'Class ID is required' });
  }

  const assignments = await getAssignmentsByClass_id(class_id);
  res.json(assignments);
}

handleGetAssignments_attachmentsByAssignment_id = async(req,res)=>{
  const assignment_id = req.params.assignment_id;
  if (!assignment_id) {
    return res.status(400).json({ error: 'Assignment ID is required' });
  }

  const attachments = await getAssignments_attachmentsByAssignment_id(assignment_id);
  if (!attachments) {
    return res.status(404).json({ error: 'No attachments found for this assignment' });
  }

  const attachmentsWithLinks = attachments.map(attachment => ({
    ...attachment,
    file_link: `${req.protocol}://${req.get('host')}/uploads/${attachment.file_link}`
  }));

  res.json(attachmentsWithLinks);
}

handleGetSubmissionsByAssignment_id = async(req,res)=>{
  const assignment_id = req.params.assignment_id;
  if (!assignment_id) {
    return res.status(400).json({ error: 'Assignment ID is required' });
  }

  const submissions = await getSubmissionsByAssignment_id(assignment_id);
  res.json(submissions);
}

handleGetGradesByAssignment_id = async(req,res)=>{
  const assignment_id = req.params.assignment_id;
  if (!assignment_id) {
    return res.status(400).json({ error: 'Assignment ID is required' });
  }

  const grades = await getGradesByAssignment_id(assignment_id);
  res.json(grades);
}

handleGetGradesByStudent_id = async(req,res)=>{
  const student_id = req.user.student_id; // Assuming user info is attached to request by auth middleware
  if (!student_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const grades = await getGradesByStudent_id(student_id);
  res.json(grades);
}






module.exports = {
  handleJoinClasses,
  handleSubmissionUpload,
  handleCreateAssigment,
  handleAssigmnets_attachments,

  handleGetAssignmentsByClass_id,
  handleGetAssignments_attachmentsByAssignment_id,
  handleGetSubmissionsByAssignment_id,
  handleGetGradesByAssignment_id,
  handleGetGradesByStudent_id
}