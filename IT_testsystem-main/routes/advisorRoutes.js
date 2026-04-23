const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Absence = require('../models/Absence');
const Schedule = require('../models/Schedule');

// ========== 1. البحث عن طالب (بأكثر من طريقة) ==========
router.get('/search-student', async (req, res) => {
    try {
        const { universityId, name, email } = req.query;
        let query = { role: 'student' };
        
        if (universityId) query.universityId = universityId;
        if (name) query.name = { $regex: name, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };
        
        const user = await User.findOne(query);
        if (!user) {
            return res.json({ success: false, message: 'الطالب غير موجود' });
        }
        
        const studentInfo = await Student.findOne({ userId: user._id });
        const enrollments = await Enrollment.find({ studentId: user._id }).populate('courseId');
        const grades = await Grade.find({ studentId: user._id }).populate('courseId');
        const attendance = await Attendance.find({ studentId: user._id }).populate('courseId');
        const absence = await Absence.find({ studentId: user._id }).populate('courseId');
        const schedule = await Schedule.find({ studentId: user._id }).populate('courseId');
        
        res.json({
            success: true,
            student: {
                ...user.toObject(),
                studentInfo,
                enrollments,
                grades,
                attendance,
                absence,
                schedule
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 2. تعديل بيانات الطالب الأساسية ==========
router.put('/update-student/:studentId', async (req, res) => {
    try {
        const { name, email, department, level, semester, gpa } = req.body;
        
        // تعديل بيانات المستخدم
        await User.findByIdAndUpdate(req.params.studentId, { name, email });
        
        // تعديل بيانات الطالب الإضافية
        await Student.findOneAndUpdate(
            { userId: req.params.studentId },
            { department, level, semester, gpa },
            { upsert: true }
        );
        
        res.json({ success: true, message: 'تم تحديث بيانات الطالب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 3. تعديل مواد الطالب (إضافة/حذف) ==========
router.post('/update-enrollments', async (req, res) => {
    try {
        const { studentId, coursesToAdd, coursesToRemove } = req.body;
        
        // إضافة مواد جديدة
        for (const courseId of coursesToAdd) {
            await Enrollment.findOneAndUpdate(
                { studentId, courseId },
                { studentId, courseId },
                { upsert: true }
            );
        }
        
        // حذف مواد
        for (const courseId of coursesToRemove) {
            await Enrollment.findOneAndDelete({ studentId, courseId });
        }
        
        res.json({ success: true, message: 'تم تحديث مواد الطالب' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 4. تعديل درجات الطالب ==========
router.put('/update-grade/:gradeId', async (req, res) => {
    try {
        const { grade } = req.body;
        await Grade.findByIdAndUpdate(req.params.gradeId, { grade });
        res.json({ success: true, message: 'تم تحديث الدرجة' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 5. تعديل الغياب ==========
router.put('/update-absence/:absenceId', async (req, res) => {
    try {
        const { lectureAbsences, sectionAbsences } = req.body;
        await Absence.findByIdAndUpdate(req.params.absenceId, { lectureAbsences, sectionAbsences });
        res.json({ success: true, message: 'تم تحديث الغياب' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 6. تعديل جدول الطالب ==========
router.put('/update-schedule/:scheduleId', async (req, res) => {
    try {
        const { day, time, room } = req.body;
        await Schedule.findByIdAndUpdate(req.params.scheduleId, { day, time, room });
        res.json({ success: true, message: 'تم تحديث الجدول' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== 7. حذف طالب بالكامل ==========
router.delete('/delete-student/:studentId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.studentId);
        await Student.findOneAndDelete({ userId: req.params.studentId });
        await Enrollment.deleteMany({ studentId: req.params.studentId });
        await Grade.deleteMany({ studentId: req.params.studentId });
        await Attendance.deleteMany({ studentId: req.params.studentId });
        await Absence.deleteMany({ studentId: req.params.studentId });
        await Schedule.deleteMany({ studentId: req.params.studentId });
        
        res.json({ success: true, message: 'تم حذف الطالب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;