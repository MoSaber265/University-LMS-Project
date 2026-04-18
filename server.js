const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// الربط بقاعدة البيانات
mongoose.connect('mongodb://localhost:27017/universityDB')
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Database error:', err));

// عشان السيرفر يقرأ ملفات الـ HTML والـ CSS اللي في فولدر public
app.use(express.static('public'));
app.use(express.json());

// تشغيل أول صفحة
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// السيرفر شغال على بورت 3000
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});