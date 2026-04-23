const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Schedule = require('../models/Schedule');
const Material = require('../models/Material');
const Student = require('../models/Student');
const Absence = require('../models/Absence');

// ========== تسجيل الدخول (نسخة محسنة ومؤمنة) ==========
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        // 1. تنظيف البيانات (إزالة المسافات وتحويل الحروف لصغيرة)
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'يرجى إدخال البريد وكلمة المرور' });
        }
        email = email.trim().toLowerCase();

        console.log('محاولة تسجيل دخول لـ:', email);

        // 2. البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'البريد الإلكتروني غير موجود' });
        }

        // 3. التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'كلمة المرور غير صحيحة' });
        }

        console.log('تم تسجيل الدخول بنجاح كـ:', user.role);

        // 4. تجهيز الرد الأساسي
        const responseData = {
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                universityId: user.universityId
            }
        };

        // 5. جلب بيانات إضافية حسب الدور لسرعة التحميل في الفرونت آند
        if (user.role === 'student') {
            const [courses, grades, attendance] = await Promise.all([
                Enrollment.find({ studentId: user._id }).populate('courseId'),
                Grade.find({ studentId: user._id }).populate('courseId'),
                Attendance.find({ studentId: user._id }).populate('courseId')
            ]);
            
            responseData.courses = courses || [];
            responseData.grades = grades || [];
            responseData.attendance = attendance || [];
        } 
        else if (user.role === 'doctor') {
            const teachingCourses = await Course.find({ doctorId: user._id });
            responseData.teachingCourses = teachingCourses || [];
        }

        res.json(responseData);

    } catch (error) {
        console.error('خطأ في Login:', error);
        res.status(500).json({ success: false, message: 'خطأ داخلي في السيرفر' });
    }
});

// ========== إضافة مستخدم (تشفير تلقائي للباسورد) ==========
router.post('/add-user', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // التحقق من وجود المستخدم مسبقًا
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'المستخدم موجود بالفعل' });
        }

        // تشفير الباسورد
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            ...req.body,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        res.json({ success: true, message: 'تم إضافة المستخدم بنجاح', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== البحث عن طالب (بواسطة الرقم الجامعي) ==========
router.get('/search-student/:universityId', async (req, res) => {
    try {
        const user = await User.findOne({ universityId: req.params.universityId, role: 'student' });
        if (!user) {
            return res.json({ success: false, message: 'الطالب غير موجود' });
        }

        // جلب كل البيانات المتعلقة بالطالب في طلب واحد لتقليل الضغط
        const [studentInfo, grades, attendance, absence, schedule, enrollments] = await Promise.all([
            Student.findOne({ userId: user._id }),
            Grade.find({ studentId: user._id }).populate('courseId'),
            Attendance.find({ studentId: user._id }).populate('courseId'),
            Absence.find({ studentId: user._id }).populate('courseId'),
            Schedule.find({ studentId: user._id }).populate('courseId'),
            Enrollment.find({ studentId: user._id }).populate('courseId')
        ]);

        res.json({
            success: true,
            user: user.toObject(),
            studentInfo: studentInfo || {},
            grades,
            attendance,
            absence,
            schedule,
            enrollments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== تحديث مستخدم (مع تنظيف البيانات) ==========
router.put('/update-user/:userId', async (req, res) => {
    try {
        const { name, email, universityId, role } = req.body;
        const updatedData = { 
            name, 
            email: email ? email.toLowerCase().trim() : undefined, 
            universityId, 
            role 
        };

        await User.findByIdAndUpdate(req.params.userId, updatedData);
        res.json({ success: true, message: 'تم تحديث البيانات' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== حذف مستخدم ==========
router.delete('/delete-user/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== راوتات مساعدة (Getters) ==========
router.get('/students', async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        res.json({ success: true, students: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/course-students/:courseId', async (req, res) => {
    try {
        const students = await Enrollment.find({ courseId: req.params.courseId }).populate('studentId');
        res.json(students || []);
    } catch (error) {
        res.json([]);
    }
});

module.exports = router;