// =========================================================
// 1. Core API Helper (API Caller)
// =========================================================
async function apiCall(url, method = 'GET', body = null) {
    const options = { 
        method, 
        headers: { 'Content-Type': 'application/json' } 
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const res = await fetch(url, options);
        return await res.json();
    } catch (err) {
        console.error("API Error:", err);
        return { success: false, message: "Error connecting to the server" };
    }
}

// =========================================================
// 2. Authentication & Redirect System
// =========================================================
async function handleLogin(event) {
    if(event) event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) return alert("Please enter both email and password!");

    const data = await apiCall('/api/auth/login', 'POST', { email, password });

    if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'student') {
            localStorage.setItem('studentData', JSON.stringify({
                courses: data.courses || [],
                grades: data.grades || [],
                attendance: data.attendance || []
            }));
        } else if (data.user.role === 'doctor') {
            localStorage.setItem('doctorCourses', JSON.stringify(data.teachingCourses || []));
        }

        const roleRedirects = {
            student: 'views/student-dashboard.html',
            doctor: 'views/doctor-dashboard.html',
            advisor: 'views/advisor-dashboard.html',
            admin: 'views/admin-dashboard.html'
        };

        window.location.href = roleRedirects[data.user.role] || 'index.html';
    } else {
        alert(data.message || "Invalid login credentials!");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/';
}

// =========================================================
// 3. Student Dashboard Logic
// =========================================================
async function initStudentDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'student') {
        logout();
        return;
    }

    if(document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').innerText = user.name;
    }

    const studentData = JSON.parse(localStorage.getItem('studentData'));
    
    if (studentData && studentData.grades) {
        const totalGrades = studentData.grades.reduce((sum, g) => sum + (g.grade || 0), 0);
        const avg = studentData.grades.length > 0 ? (totalGrades / studentData.grades.length).toFixed(1) : 0;
        
        if (document.getElementById('gpaDisplay')) document.getElementById('gpaDisplay').innerText = `${avg}%`;
        if (document.getElementById('coursesCount')) document.getElementById('coursesCount').innerText = studentData.courses.length;
    }

    const schedule = await apiCall(`/api/auth/student-schedule/${user._id}`);
    const scheduleBody = document.getElementById('scheduleBody');
    
    if (scheduleBody && schedule && Array.isArray(schedule)) {
        if(schedule.length === 0) {
            scheduleBody.innerHTML = '<tr><td colspan="3">No lectures scheduled</td></tr>';
        } else {
            scheduleBody.innerHTML = schedule.map(item => `
                <tr>
                    <td>${item.courseId ? item.courseId.title : 'Unknown Subject'}</td>
                    <td>${item.day || ''} - ${item.time || ''}</td>
                    <td>${item.room || 'Hall 1'}</td>
                </tr>
            `).join('');
        }
    }
}

// =========================================================
// 4. Doctor (Professor) Dashboard Logic
// =========================================================
async function initDoctorDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'doctor') {
        logout();
        return;
    }

    if(document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').innerText = `Dr. ${user.name}`;
    }

    const courses = JSON.parse(localStorage.getItem('doctorCourses')) || [];
    const courseSelect = document.getElementById('courseSelect');
    
    if (courseSelect) {
        courseSelect.innerHTML = '<option value="">Select a Course...</option>' + 
            courses.map(c => `<option value="${c._id}">${c.title}</option>`).join('');

        courseSelect.addEventListener('change', function() {
            if (this.value) {
                loadCourseStudents(this.value);
            } else {
                const listArea = document.getElementById('studentsList');
                if(listArea) listArea.innerHTML = '';
            }
        });
    }
}

async function loadCourseStudents(courseId) {
    const students = await apiCall(`/api/auth/course-students/${courseId}`);
    const listArea = document.getElementById('studentsList');

    if (!students || students.length === 0) {
        listArea.innerHTML = '<p style="padding: 20px;">No students currently enrolled in this course.</p>';
        return;
    }

    listArea.innerHTML = `
        <table style="width:100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border:1px solid #ddd; padding:8px;">Student Name</th>
                    <th style="border:1px solid #ddd; padding:8px;">Assessment Type</th>
                    <th style="border:1px solid #ddd; padding:8px;">Grade</th>
                    <th style="border:1px solid #ddd; padding:8px;">Action</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(s => {
                    const student = s.studentId || s;
                    return `
                    <tr>
                        <td style="border:1px solid #ddd; padding:8px;">${student.name || 'Unknown'}</td>
                        <td style="border:1px solid #ddd; padding:8px;"><input type="text" id="type-${student._id}" placeholder="e.g. Midterm"></td>
                        <td style="border:1px solid #ddd; padding:8px;"><input type="number" id="grade-${student._id}" placeholder="Grade"></td>
                        <td style="border:1px solid #ddd; padding:8px;"><button onclick="saveCustomGrade('${student._id}', '${courseId}')">Save</button></td>
                    </tr>
                `}).join('')}
            </tbody>
        </table>
    `;
}

async function saveCustomGrade(studentId, courseId) {
    const type = document.getElementById(`type-${studentId}`).value;
    const grade = document.getElementById(`grade-${studentId}`).value;

    if (!type || !grade) return alert('Please enter both assessment type and grade!');

    const res = await apiCall('/api/auth/add-custom-grade', 'POST', { studentId, courseId, type, grade: parseFloat(grade) });
    if (res.success) {
        alert('Grade saved successfully!');
        document.getElementById(`type-${studentId}`).value = '';
        document.getElementById(`grade-${studentId}`).value = '';
    } else {
        alert('An error occurred while saving the grade.');
    }
}

// =========================================================
// 5. Academic Advisor Dashboard Logic
// =========================================================
async function initAdvisorDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'advisor') {
        logout();
        return;
    }

    if(document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').innerText = `Advisor: ${user.name}`;
    }
}

async function searchStudentForAdvisor() {
    const universityId = document.getElementById('searchID').value;
    if (!universityId) return alert("Please enter the University ID first");

    const data = await apiCall(`/api/auth/search-student/${universityId}`);
    const resultArea = document.getElementById('searchResultArea');

    if (data.success) {
        resultArea.innerHTML = `
            <div style="margin-top: 20px; padding:20px; background:white; border-radius:10px;">
                <h4>Student: ${data.user.name}</h4>
                <p>Email: ${data.user.email}</p>
                <p>University ID: ${data.user.universityId}</p>
                <hr>
                <h5>Grades:</h5>
                <ul>
                    ${data.grades.map(g => `<li>${g.courseId ? g.courseId.title : 'Course'} - ${g.type}: ${g.grade}</li>`).join('')}
                </ul>
                <h5>Attendance:</h5>
                <ul>
                    ${data.attendance.map(a => `<li>${a.courseId ? a.courseId.title : 'Course'} - ${a.status} - ${new Date(a.date).toLocaleDateString()}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        resultArea.innerHTML = '<p style="color: red; padding: 20px;">Student not found. Please verify the ID.</p>';
    }
}

// =========================================================
// 6. Admin Dashboard Logic
// =========================================================
async function initAdminDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        logout();
        return;
    }

    if(document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').innerText = `Admin: ${user.name}`;
    }

    // Fetch all users
    const data = await apiCall('/api/auth/students');
    const usersList = document.getElementById('usersList');
    
    if (usersList && data.success) {
        const students = data.students.filter(u => u.role === 'student');
        const doctors = data.students.filter(u => u.role === 'doctor');
        
        if(document.getElementById('studentsCount')) {
            document.getElementById('studentsCount').innerText = students.length;
            document.getElementById('doctorsCount').innerText = doctors.length;
        }
        
        usersList.innerHTML = students.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.universityId}</td>
                <td>Student</td>
            </tr>
        `).join('');
    }
}

// =========================================================
// 7. Global Initialization
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // Using US English format for global compatibility
        dateElement.innerText = new Date().toLocaleDateString('en-US', options);
    }

    // Detect current page and initialize specific dashboard
    const path = window.location.pathname;
    
    if (path.includes('student-dashboard')) {
        initStudentDashboard();
    } else if (path.includes('doctor-dashboard')) {
        initDoctorDashboard();
    } else if (path.includes('advisor-dashboard')) {
        initAdvisorDashboard();
    } else if (path.includes('admin-dashboard')) {
        initAdminDashboard();
    }
});