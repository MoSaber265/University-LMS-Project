const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const AvailableCourse = require('../models/AvailableCourse');
const Student = require('../models/Student');
const Grade = require('../models/Grade'); // تم إضافة استدعاء موديل الدرجات

// 1. جلب المواد المسجل فيها
router.get('/:studentId/courses', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ studentId: req.params.studentId }).populate('courseId');
        const courses = enrollments.map(e => e.courseId);
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. جلب الدرجات من موديل Grade الجديد
router.get('/:studentId/grades', async (req, res) => {
    try {
        const grades = await Grade.find({ studentId: req.params.studentId }).populate('courseId');
        res.json({ success: true, grades });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. جلب المواد المتاحة للتسجيل
router.get('/:studentId/available-courses', async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.params.studentId });
        if (!student) return res.json({ success: false, message: 'Student data incomplete' });
        
        const available = await AvailableCourse.find({ 
            department: student.department, 
            level: student.level 
        }).populate('courseId');
        
        const enrolled = await Enrollment.find({ studentId: req.params.studentId });
        const enrolledIds = enrolled.map(e => e.courseId.toString());
        const notEnrolled = available.filter(a => !enrolledIds.includes(a.courseId._id.toString()));
        
        res.json({ success: true, courses: notEnrolled.map(a => a.courseId) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. تسجيل مادة جديدة
router.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId, semester } = req.body;
        const existing = await Enrollment.findOne({ studentId, courseId });
        if (existing) return res.json({ success: false, message: 'Already enrolled' });
        
        await Enrollment.create({ studentId, courseId, semester });
        res.json({ success: true, message: 'Success' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;