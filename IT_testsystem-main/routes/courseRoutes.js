const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// عرض كل المواد المتاحة في الجامعة
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('doctorId', 'name');
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المواد' });
  }
});

module.exports = router;