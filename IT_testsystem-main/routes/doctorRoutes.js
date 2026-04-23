const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Grade = require('../models/Grade');
const Absence = require('../models/Absence');
const Student = require('../models/Student');

// ========== 1. جلب المواد التي يدرسها الدكتور ==========
router.get('/:doctorId/courses', async (req, res) => {
    try {
        const courses = await Course.find({ doctorId: req.params.doctorId });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 2. البحث عن الطلاب (بالقسم + السنة + الترم) ==========
router.post('/search-students', async (req, res) => {
    try {
        const { department, level, semester, courseId } = req.body;
        
        // جلب الطلاب حسب القسم والسنة
        let students = await Student.find({ department, level }).populate('userId');
        
        // فلترة حسب المواد المسجل فيها
        if (courseId) {
            const enrollments = await Enrollment.find({ courseId }).populate('studentId');
            const enrolledStudentIds = enrollments.map(e => e.studentId._id.toString());
            students = students.filter(s => enrolledStudentIds.includes(s.userId._id.toString()));
        }
        
        const studentsWithDetails = await Promise.all(students.map(async (student) => {
            const grades = await Grade.find({ 
                studentId: student.userId._id, 
                courseId 
            });
            const absence = await Absence.findOne({ 
                studentId: student.userId._id, 
                courseId 
            });
            
            return {
                _id: student.userId._id,
                name: student.userId.name,
                universityId: student.userId.universityId,
                email: student.userId.email,
                department: student.department,
                level: student.level,
                grades,
                absence: absence || { lectureAbsences: 0, sectionAbsences: 0 }
            };
        }));
        
        res.json({ success: true, students: studentsWithDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 3. إضافة/تعديل درجة لطالب ==========
router.post('/add-grade', async (req, res) => {
    try {
        const { studentId, courseId, type, grade, totalGrade } = req.body;
        
        const existingGrade = await Grade.findOne({ studentId, courseId, type });
        if (existingGrade) {
            existingGrade.grade = grade;
            await existingGrade.save();
        } else {
            await Grade.create({ studentId, courseId, type, grade, totalGrade: totalGrade || 100 });
        }
        
        res.json({ success: true, message: 'تم حفظ الدرجة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 4. إضافة/تعديل غياب لطالب ==========
router.post('/add-absence', async (req, res) => {
    try {
        const { studentId, courseId, lectureAbsences, sectionAbsences } = req.body;
        
        const existingAbsence = await Absence.findOne({ studentId, courseId });
        if (existingAbsence) {
            existingAbsence.lectureAbsences = lectureAbsences;
            existingAbsence.sectionAbsences = sectionAbsences;
            await existingAbsence.save();
        } else {
            await Absence.create({ studentId, courseId, lectureAbsences, sectionAbsences });
        }
        
        res.json({ success: true, message: 'تم تحديث الغياب' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 5. جلب جميع الأقسام (للقوائم المنسدلة) ==========
router.get('/departments', async (req, res) => {
    try {
        const departments = await Student.distinct('department');
        res.json({ success: true, departments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 6. جلب السنوات الدراسية ==========
router.get('/levels', async (req, res) => {
    try {
        const levels = await Student.distinct('level');
        res.json({ success: true, levels: levels.sort() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;