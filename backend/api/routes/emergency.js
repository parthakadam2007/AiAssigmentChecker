const express = require('express');
const router = express.Router();
const { sendEmergencyNotification } = require('../services/notificationService');
const { getStudentsByClassId, getStudentsByTeacherId, getClassesByTeacherId } = require('../models/classModels');

router.post('/', async (req, res) => {
  try {
    const { teacherId, classId, message } = req.body;
    
    let students;
    
    if (classId) {
      // Get students from a specific class
      students = await getStudentsByClassId(classId);
    } else if (teacherId) {
      // Get all students from all classes taught by this teacher
      students = await getStudentsByTeacherId(teacherId);
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Either teacherId or classId is required' 
      });
    }
    
    if (students.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No students found' 
      });
    }
    
    // Send notifications
    const defaultMessage = message || 'Emergency alert! Please check with your teacher immediately.';
    const results = await sendEmergencyNotification(students, defaultMessage);
    
    res.json({
      success: true,
      message: `Emergency notification sent to ${results.sent} students`,
      details: results
    });
  } catch (error) {
    console.error('Emergency notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send emergency notifications' 
    });
  }
});

// Get classes for a teacher (for frontend dropdown)
router.get('/classes/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const classes = await getClassesByTeacherId(teacherId);
    
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch classes' 
    });
  }
});

module.exports = router;