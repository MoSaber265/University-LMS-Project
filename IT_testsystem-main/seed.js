const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to Database
mongoose.connect('mongodb://127.0.0.1:27017/university_lms')
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        await seedDatabase();
    })
    .catch(err => console.error('❌ Connection Error:', err));

async function seedDatabase() {
    try {
        // Clear Old Data
        console.log('🗑️ Clearing old data...');
        await mongoose.connection.db.dropDatabase();
        console.log('✅ Database cleared');

        const hashedPassword = await bcrypt.hash('123456', 10);

        // ========== 1. Create Users ==========
        console.log('👥 Creating users...');

        const users = await mongoose.connection.collection('users').insertMany([
            { name: 'Ahmed Student', email: 'ahmed@student.com', password: hashedPassword, universityId: '2024001', role: 'student', createdAt: new Date() },
            { name: 'Sara Student', email: 'sara@student.com', password: hashedPassword, universityId: '2024002', role: 'student', createdAt: new Date() },
            { name: 'Mohamed Student', email: 'mohamed@student.com', password: hashedPassword, universityId: '2024003', role: 'student', createdAt: new Date() },
            { name: 'Dr. Khaled', email: 'khaled@doctor.com', password: hashedPassword, universityId: 'DOC001', role: 'doctor', createdAt: new Date() },
            { name: 'Dr. Noura', email: 'noura@doctor.com', password: hashedPassword, universityId: 'DOC002', role: 'doctor', createdAt: new Date() },
            { name: 'Mr. Mahmoud (Advisor)', email: 'advisor@test.com', password: hashedPassword, universityId: 'ADV001', role: 'advisor', createdAt: new Date() },
            { name: 'Admin User', email: 'admin@test.com', password: hashedPassword, universityId: 'ADMIN001', role: 'admin', createdAt: new Date() }
        ]);

        console.log(`✅ Created ${users.insertedCount} users`);

        const ahmedId = users.insertedIds[0];
        const saraId = users.insertedIds[1];
        const mohamedId = users.insertedIds[2];
        const khaledId = users.insertedIds[3];
        const nouraId = users.insertedIds[4];

        // ========== 2. Create Student Data ==========
        console.log('📝 Creating student profiles...');
        
        await mongoose.connection.collection('students').insertMany([
            { userId: ahmedId, department: 'Computer Science', level: 3, semester: 'Fall 2024', gpa: 3.75, createdAt: new Date() },
            { userId: saraId, department: 'Computer Science', level: 2, semester: 'Fall 2024', gpa: 3.90, createdAt: new Date() },
            { userId: mohamedId, department: 'Information Systems', level: 1, semester: 'Fall 2024', gpa: 3.20, createdAt: new Date() }
        ]);

        // ========== 3. Create Courses ==========
        console.log('📚 Creating courses...');

        const courses = await mongoose.connection.collection('courses').insertMany([
            { title: 'Database Systems', code: 'DB101', doctorId: khaledId, createdAt: new Date() },
            { title: 'Web Programming', code: 'WEB201', doctorId: khaledId, createdAt: new Date() },
            { title: 'Data Structures', code: 'DS102', doctorId: nouraId, createdAt: new Date() },
            { title: 'Artificial Intelligence', code: 'AI301', doctorId: nouraId, createdAt: new Date() },
            { title: 'Information Security', code: 'SEC401', doctorId: khaledId, createdAt: new Date() },
            { title: 'Software Engineering', code: 'SE202', doctorId: nouraId, createdAt: new Date() }
        ]);

        console.log(`✅ Created ${courses.insertedCount} courses`);

        const dbId = courses.insertedIds[0];
        const webId = courses.insertedIds[1];
        const dsId = courses.insertedIds[2];
        const aiId = courses.insertedIds[3];
        const secId = courses.insertedIds[4];
        const seId = courses.insertedIds[5];

        // ========== 4. Course Enrollments ==========
        console.log('📝 Registering students...');

        await mongoose.connection.collection('enrollments').insertMany([
            { studentId: ahmedId, courseId: dbId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: ahmedId, courseId: webId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: ahmedId, courseId: dsId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: ahmedId, courseId: aiId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: saraId, courseId: dbId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: saraId, courseId: webId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: saraId, courseId: seId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: mohamedId, courseId: dsId, semester: 'Fall 2024', createdAt: new Date() },
            { studentId: mohamedId, courseId: aiId, semester: 'Fall 2024', createdAt: new Date() }
        ]);

        // ========== 5. Create Grades ==========
        console.log('📊 Creating grades...');

        await mongoose.connection.collection('grades').insertMany([
            { studentId: ahmedId, courseId: dbId, type: 'Quiz 1', grade: 85, totalGrade: 100, date: new Date('2024-10-01') },
            { studentId: ahmedId, courseId: dbId, type: 'Midterm', grade: 78, totalGrade: 100, date: new Date('2024-11-01') },
            { studentId: ahmedId, courseId: webId, type: 'Quiz 1', grade: 92, totalGrade: 100, date: new Date('2024-10-05') },
            { studentId: ahmedId, courseId: webId, type: 'Assignment', grade: 88, totalGrade: 100, date: new Date('2024-10-20') },
            { studentId: ahmedId, courseId: dsId, type: 'Quiz 1', grade: 75, totalGrade: 100, date: new Date('2024-10-03') },
            { studentId: ahmedId, courseId: aiId, type: 'Midterm', grade: 90, totalGrade: 100, date: new Date('2024-11-10') },
            { studentId: saraId, courseId: dbId, type: 'Quiz 1', grade: 95, totalGrade: 100, date: new Date('2024-10-01') },
            { studentId: saraId, courseId: dbId, type: 'Midterm', grade: 88, totalGrade: 100, date: new Date('2024-11-01') }
        ]);

        // ========== 6. Attendance Records ==========
        console.log('✅ Creating attendance...');

        await mongoose.connection.collection('attendances').insertMany([
            { studentId: ahmedId, courseId: dbId, status: 'Present', date: new Date('2024-10-07') },
            { studentId: ahmedId, courseId: dbId, status: 'Absent', date: new Date('2024-10-21') },
            { studentId: saraId, courseId: dbId, status: 'Present', date: new Date('2024-10-07') }
        ]);

        // ========== 7. Detailed Absences ==========
        console.log('📊 Creating absences...');

        await mongoose.connection.collection('absences').insertMany([
            { studentId: ahmedId, courseId: dbId, lectureAbsences: 2, sectionAbsences: 1, semester: 'Fall 2024' },
            { studentId: ahmedId, courseId: dsId, lectureAbsences: 3, sectionAbsences: 2, semester: 'Fall 2024' }
        ]);

        // ========== 8. Schedules ==========
        console.log('📅 Creating schedules...');

        await mongoose.connection.collection('schedules').insertMany([
            { studentId: ahmedId, courseId: dbId, day: 'Sunday', time: '09:00 - 11:00', room: 'Hall 101' },
            { studentId: ahmedId, courseId: webId, day: 'Monday', time: '11:00 - 13:00', room: 'Lab 2' },
            { studentId: ahmedId, courseId: dsId, day: 'Tuesday', time: '09:00 - 11:00', room: 'Hall 102' }
        ]);

        // ========== 9. Available Courses ==========
        console.log('📚 Creating available courses...');

        await mongoose.connection.collection('availablecourses').insertMany([
            { courseId: dbId, department: 'Computer Science', level: 3, semester: 'Fall 2024', capacity: 50, enrolledCount: 2 },
            { courseId: webId, department: 'Computer Science', level: 3, semester: 'Fall 2024', capacity: 50, enrolledCount: 2 },
            { courseId: secId, department: 'Computer Science', level: 4, semester: 'Fall 2024', capacity: 50, enrolledCount: 0 }
        ]);

        // ========== 10. Lectures/Materials ==========
        console.log('📁 Creating materials...');

        await mongoose.connection.collection('materials').insertMany([
            { courseId: dbId, title: 'Introduction to DB', link: 'https://example.com/db1', date: new Date('2024-10-01') },
            { courseId: webId, title: 'HTML/CSS Basics', link: 'https://example.com/web1', date: new Date('2024-10-02') }
        ]);

        // ========== 11. Doctor Data ==========
        console.log('👨‍🏫 Creating doctor profiles...');

        await mongoose.connection.collection('doctors').insertMany([
            { userId: khaledId, department: 'Computer Science', title: 'Professor', createdAt: new Date() },
            { userId: nouraId, department: 'Computer Science', title: 'Doctor', createdAt: new Date() }
        ]);

        // ========== Summary Output ==========
        console.log('\n========================================');
        console.log('🎉 Database Seeded Successfully!');
        console.log('========================================');
        console.log('📊 Statistics:');
        console.log(`   Users: ${users.insertedCount}`);
        console.log(`   Courses: ${courses.insertedCount}`);
        console.log('========================================');
        console.log('\n🔑 Test Accounts:');
        console.log('----------------------------------------');
        console.log('🎓 Student:     ahmed@student.com / 123456');
        console.log('👨‍🏫 Doctor:      khaled@doctor.com / 123456');
        console.log('👑 Admin:       admin@test.com / 123456');
        console.log('========================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}