const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, 'views')));

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const advisorRoutes = require('./routes/advisorRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/advisor', advisorRoutes);

// Page Routing
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

const MONGO_URI = 'mongodb://127.0.0.1:27017/university_lms';
const PORT = 5000;

// Database Connection & Server Start
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to Database Successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on: http://localhost:${PORT}`);
            console.log(`📋 Access the app here: http://localhost:${PORT}/login.html`);
        });
    })
    .catch(err => {
        console.error('❌ Connection Error:', err.message);
    });