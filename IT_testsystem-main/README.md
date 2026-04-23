

بكل سرور، هقدم لك التوثيق الاحترافي الكامل للمشروع باسم "نظام إدارة كلية الحاسبات والمعلومات".
💻 Faculty of Computing and Information Management System (FCIMS)
نظام إدارة كلية الحاسبات والمعلومات المتكامل
🏆 Documentation Version 1.0
Software Engineering Documentation
📋 ملخص المشروع (Project Overview)

نظام إدارة كلية الحاسبات والمعلومات هو نظام متكامل مصمم خصيصاً لإدارة كليات الحاسبات والمعلومات، يدعم أربعة أدوار رئيسية:
الرمز	الدور	الصلاحيات
👨‍🎓	طالب (Student)	متابعة المواد، الدرجات، الغياب، تسجيل المواد، الجدول الدراسي
👨‍🏫	دكتور (Doctor)	إدارة المواد، إضافة درجات، إدارة الغياب، البحث عن الطلاب
🎓	مرشد أكاديمي (Advisor)	صلاحيات كاملة (تعديل بيانات الطلاب، المواد، الجدول، الدرجات)
👑	أدمن (Admin)	إدارة كاملة للمستخدمين (إضافة، تعديل، حذف)

التقنيات المستخدمة:
الطبقة	التقنية	الإصدار
Backend	Node.js + Express.js	v18+
Database	MongoDB + Mongoose ODM	v7+
Frontend	HTML5 + CSS3 + JavaScript	Vanilla
Authentication	bcrypt	v5+
Server	Express.js	v4+
🗂️ هيكل المشروع (Project Structure)
text

Faculty-of-Computing-and-Information-Management-System/
│
├── 📁 models/                        # نماذج قاعدة البيانات
│   ├── Absence.js                   # الغياب التفصيلي (محاضرات/سكاشن)
│   ├── Attendance.js                # الحضور اليومي
│   ├── AvailableCourse.js           # المواد المتاحة للتسجيل
│   ├── Course.js                    # المواد الدراسية
│   ├── Doctor.js                    # بيانات الدكاترة الإضافية
│   ├── Enrollment.js                # تسجيل الطلاب في المواد
│   ├── Grade.js                     # الدرجات والتقييمات
│   ├── Material.js                  # المحاضرات المسجلة
│   ├── Schedule.js                  # الجدول الدراسي
│   ├── Student.js                   # بيانات الطلاب الإضافية
│   └── User.js                      # المستخدم الأساسي
│
├── 📁 routes/                        # مسارات API
│   ├── advisorRoutes.js             # خدمات المرشد الأكاديمي
│   ├── authRoutes.js                # المصادقة والتسجيل
│   ├── courseRoutes.js              # خدمات المواد الدراسية
│   ├── doctorRoutes.js              # خدمات الدكتور
│   └── studentRoutes.js             # خدمات الطالب
│
├── 📁 Public/                        # الملفات الثابتة
│   ├── 📁 css/
│   │   └── style.css               # التنسيقات العامة
│   ├── 📁 js/
│   │   └── main.js                 # الدوال المشتركة
│   └── index.html                   # الصفحة الرئيسية
│
├── 📁 views/                         # صفحات الواجهة
│   ├── admin-dashboard.html         # لوحة تحكم الأدمن
│   ├── advisor-dashboard.html       # لوحة تحكم المرشد
│   ├── doctor-dashboard.html        # لوحة تحكم الدكتور
│   ├── student-dashboard.html       # لوحة تحكم الطالب
│   ├── search-student.html          # صفحة بحث الطلاب
│   ├── login.html                   # صفحة تسجيل الدخول
│   ├── register.html                # صفحة التسجيل
│   └── index.html                   # الصفحة الترحيبية
│
├── 📄 .env                           # متغيرات البيئة
├── 📄 package.json                   # حزم المشروع
├── 📄 package-lock.json              # قفل الإصدارات
├── 📄 server.js                      # تشغيل السيرفر
├── 📄 seed.js                        # تعبئة قاعدة البيانات
└── 📄 README.md                      # ملف التعريف

📦 شرح نماذج قاعدة البيانات (Models)
1. User.js - المستخدم الأساسي
javascript

{
    name: String,           // الاسم الكامل
    email: String,          // البريد الإلكتروني (فريد)
    password: String,       // كلمة المرور (مشفرة)
    universityId: String,   // الكود الجامعي (فريد)
    role: String            // الدور: student, doctor, advisor, admin
}

2. Student.js - بيانات الطالب
javascript

{
    userId: ObjectId,       // مرجع لـ User
    department: String,     // القسم (علوم حاسب، نظم معلومات، ذكاء اصطناعي)
    level: Number,          // المستوى/السنة (1-4)
    semester: String,       // الفصل الدراسي
    gpa: Number             // المعدل التراكمي
}

3. Doctor.js - بيانات الدكتور
javascript

{
    userId: ObjectId,       // مرجع لـ User
    department: String,     // القسم التابع له
    title: String           // اللقب: Professor, Doctor, TA
}

4. Course.js - المواد الدراسية
javascript

{
    title: String,          // اسم المادة
    code: String,           // كود المادة (فريد)
    doctorId: ObjectId      // مرجع للدكتور المدرس
}

5. Enrollment.js - تسجيل المواد
javascript

{
    studentId: ObjectId,    // مرجع للطالب
    courseId: ObjectId,     // مرجع للمادة
    semester: String        // الفصل الدراسي
}

6. Grade.js - الدرجات
javascript

{
    studentId: ObjectId,    // مرجع للطالب
    courseId: ObjectId,     // مرجع للمادة
    type: String,           // نوع التقييم (Quiz, Midterm, Final)
    grade: Number,          // الدرجة
    totalGrade: Number,     // الدرجة العظمى
    date: Date              // تاريخ الإضافة
}

7. Attendance.js - الحضور
javascript

{
    studentId: ObjectId,    // مرجع للطالب
    courseId: ObjectId,     // مرجع للمادة
    status: String,         // Present, Absent
    date: Date              // تاريخ المحاضرة
}

8. Absence.js - الغياب التفصيلي
javascript

{
    studentId: ObjectId,    // مرجع للطالب
    courseId: ObjectId,     // مرجع للمادة
    lectureAbsences: Number,// عدد غياب المحاضرات
    sectionAbsences: Number,// عدد غياب السكاشن
    totalAbsences: Number,  // المجموع (يتم حسابه تلقائياً)
    semester: String        // الفصل الدراسي
}

9. Schedule.js - الجدول الدراسي
javascript

{
    studentId: ObjectId,    // مرجع للطالب
    courseId: ObjectId,     // مرجع للمادة
    day: String,            // اليوم (الأحد، الاثنين،...)
    time: String,           // الوقت (09:00 - 11:00)
    room: String            // القاعة
}

10. Material.js - المحاضرات المسجلة
javascript

{
    courseId: ObjectId,     // مرجع للمادة
    title: String,          // عنوان المحاضرة
    link: String,           // رابط المحاضرة (Drive/YouTube)
    date: Date              // تاريخ الرفع
}

11. AvailableCourse.js - المواد المتاحة
javascript

{
    courseId: ObjectId,     // مرجع للمادة
    department: String,     // القسم المسموح له
    level: Number,          // المستوى المسموح له
    semester: String,       // الفصل الدراسي
    capacity: Number,       // السعة القصوى
    enrolledCount: Number   // عدد المسجلين حالياً
}

🔗 علاقات قاعدة البيانات (ER Diagram)
text

┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    User     │
                              │  (الأساسي)  │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
              ┌──────────┐    ┌──────────┐    ┌──────────┐
              │ Student  │    │  Doctor  │    │  Admin   │
              │ (طالب)   │    │ (دكتور)  │    │ (أدمن)   │
              └────┬─────┘    └────┬─────┘    └──────────┘
                   │               │
                   │               │ 1:M
                   │               ▼
                   │         ┌──────────┐
                   │         │  Course  │
                   │         │ (مادة)   │
                   │         └────┬─────┘
                   │              │
                   │ M:N          │ 1:M
                   ▼              ▼
            ┌────────────┐  ┌────────────┐
            │Enrollment  │  │  Material  │
            │(تسجيل مواد)│  │ (محاضرات)  │
            └────────────┘  └────────────┘
                   │
                   │ 1:M
                   ▼
      ┌─────────────────────────┐
      │ Grade, Attendance,      │
      │ Absence, Schedule       │
      └─────────────────────────┘

🔌 API Endpoints التفصيلية
المصادقة (Auth Routes) - /api/auth
الطريقة	المسار	الوصف	الصلاحية
POST	/login	تسجيل الدخول	عام
POST	/add-user	إضافة مستخدم جديد	Admin
GET	/students	جلب جميع المستخدمين	Admin/Advisor
GET	/student-schedule/:studentId	جلب جدول الطالب	Student
GET	/search-student/:universityId	البحث عن طالب	Advisor
POST	/add-custom-grade	إضافة درجة	Doctor
POST	/submit-attendance	تسجيل حضور	Doctor
PUT	/update-user/:userId	تحديث مستخدم	Admin
DELETE	/delete-user/:userId	حذف مستخدم	Admin
الدكتور (Doctor Routes) - /api/doctor
الطريقة	المسار	الوصف	الصلاحية
GET	/:doctorId/courses	مواد الدكتور	Doctor
POST	/search-students	بحث عن طلاب	Doctor
POST	/add-grade	إضافة درجة	Doctor
POST	/add-absence	إضافة غياب	Doctor
GET	/departments	جلب الأقسام	Doctor
الطالب (Student Routes) - /api/student
الطريقة	المسار	الوصف	الصلاحية
GET	/:studentId/courses	مواد الطالب	Student
GET	/:studentId/available-courses	المواد المتاحة	Student
POST	/enroll	تسجيل مادة	Student
DELETE	/drop-course	حذف مادة	Student
المرشد (Advisor Routes) - /api/advisor
الطريقة	المسار	الوصف	الصلاحية
GET	/search-student	البحث عن طالب	Advisor
PUT	/update-student/:studentId	تحديث بيانات الطالب	Advisor
PUT	/update-grade/:gradeId	تحديث درجة	Advisor
PUT	/update-absence/:absenceId	تحديث غياب	Advisor
PUT	/update-schedule/:scheduleId	تحديث جدول	Advisor
POST	/update-enrollments	تحديث مواد الطالب	Advisor
DELETE	/delete-student/:studentId	حذف طالب	Advisor
🖥️ صفحات الواجهة (Frontend Pages)
الصفحة	المسار	الدور	الوظائف الرئيسية
تسجيل الدخول	/login.html	الكل	مصادقة المستخدمين
التسجيل	/register.html	الكل	إنشاء حساب جديد
لوحة الطالب	/views/student-dashboard.html	Student	مواد، درجات، غياب، تسجيل مواد، جدول
لوحة الدكتور	/views/doctor-dashboard.html	Doctor	مواد، طلاب، درجات، غياب، بحث
لوحة المرشد	/views/advisor-dashboard.html	Advisor	بحث، تعديل شامل للطلاب
لوحة الأدمن	/views/admin-dashboard.html	Admin	إدارة المستخدمين
🚀 تشغيل المشروع (Installation Guide)
المتطلبات الأساسية:
bash

Node.js (v16 أو أحدث)
MongoDB (v6 أو أحدث)

خطوات التشغيل بالترتيب:
bash

# 1. الدخول إلى مجلد المشروع
cd Faculty-of-Computing-and-Information-Management-System

# 2. تثبيت الحزم المطلوبة
npm install

# 3. تعبئة قاعدة البيانات بالبيانات التجريبية
node seed.js

# 4. تشغيل السيرفر
node server.js

# 5. فتح المتصفح على الرابط التالي
http://localhost:5000/login.html

أوامر سريعة للتشغيل:
bash

# تشغيل السيرفر مع إعادة تحميل تلقائي (للتطوير)
npm run dev

# تشغيل السيرفر العادي
npm start

# تعبئة البيانات من جديد
node seed.js

🔑 الحسابات التجريبية (Test Accounts)
الرمز	الدور	البريد الإلكتروني	كلمة المرور	الكود الجامعي
👨‍🎓	طالب	ahmed@student.com	123456	2024001
👨‍🎓	طالب	sara@student.com	123456	2024002
👨‍🎓	طالب	mohamed@student.com	123456	2024003
👨‍🏫	دكتور	khaled@doctor.com	123456	DOC001
👨‍🏫	دكتور	noura@doctor.com	123456	DOC002
🎓	مرشد	advisor@test.com	123456	ADV001
👑	أدمن	admin@test.com	123456	ADMIN001
📊 مخطط سير العمل (Workflow Diagram)
text

┌─────────────────────────────────────────────────────────────────┐
│                          START                                   │
│                    http://localhost:5000                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        /login.html                              │
│                    صفحة تسجيل الدخول                            │
│                   POST /api/auth/login                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    تحديد الدور (Role)                           │
│              يقرأ من قاعدة البيانات role الخاص بالمستخدم         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌──────────┬──────────┼──────────┬──────────┐
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │Student │ │Doctor  │ │Advisor │ │ Admin  │ │Invalid │
   └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│student-  │ │doctor-   │ │advisor-  │ │admin-    │ │العودة   │
│dashboard │ │dashboard │ │dashboard │ │dashboard │ │للتسجيل  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘

📁 ملف .env - متغيرات البيئة
env

# إعدادات السيرفر
PORT=5000

# إعدادات قاعدة البيانات
MONGO_URI=mongodb://127.0.0.1:27017/college_management

# مفتاح التشفير (JWT - للتوسع المستقبلي)
JWT_SECRET=fcims_secret_key_2024

# إعدادات إضافية
NODE_ENV=development

📦 ملف package.json - الحزم المستخدمة
json

{
  "name": "faculty-computing-management-system",
  "version": "1.0.0",
  "description": "نظام إدارة كلية الحاسبات والمعلومات المتكامل",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}

🎯 المميزات الرئيسية (Key Features)
#	الميزة	الوصف
1	✅ تعدد الأدوار	4 أدوار مختلفة بصلاحيات منفصلة
2	✅ إدارة المستخدمين	إضافة، تعديل، حذف المستخدمين
3	✅ تسجيل المواد	الطالب يسجل المواد المتاحة له
4	✅ إدارة الدرجات	إضافة وتعديل الدرجات
5	✅ إدارة الغياب	غياب المحاضرات والسكاشن بشكل تفصيلي
6	✅ الجدول الدراسي	عرض وتعديل الجدول لكل طالب
7	✅ البحث المتقدم	بحث عن الطلاب بعدة طرق
8	✅ واجهة عربية	دعم كامل للغة العربية
9	✅ تصميم متجاوب	يدعم جميع أحجام الشاشات
10	✅ API متكامل	واجهات برمجة تطبيقات جاهزة
🛠️ التوسعات المستقبلية (Future Enhancements)

    إضافة JWT Authentication للمزيد من الأمان

    إضافة نظام إشعارات (Notifications)

    دعم البريد الإلكتروني (Email Service)

    إصدار تقارير PDF (Reports Export)

    توثيق API باستخدام Swagger

    إضافة نظام الدردشة (Chat System)

    دعم رفع الملفات والصور (File Upload)

    إضافة تحليلات وإحصائيات متقدمة

    دعم اللوحات المظلمة (Dark Mode)

    إضافة نسخة للهواتف (Mobile App)

🏫 الأقسام المدعومة (Supported Departments)
القسم	الكود
علوم حاسب	CS
نظم معلومات	IS
ذكاء اصطناعي	AI
هندسة برمجيات	SE
أمن سيبراني	CY