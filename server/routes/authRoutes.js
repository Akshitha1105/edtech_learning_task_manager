const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const signupValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher'),
  body('teacherId').custom((value, { req }) => {
    if (req.body.role === 'student' && !value) {
      throw new Error('teacherId is required for students');
    }
    return true;
  }),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

router.post('/signup', signupValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { email, password, role, teacherId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    let teacherRef = null;
    if (role === 'student') {
      const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
      if (!teacher) {
        return res.status(400).json({ success: false, message: 'Invalid teacherId for student' });
      }
      teacherRef = teacher._id;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      email,
      passwordHash,
      role,
      teacherId: role === 'student' ? teacherRef : undefined,
    });

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    let teacherInfo = null;
    if (user.role === 'student' && user.teacherId) {
      const teacher = await User.findById(user.teacherId).select('email');
      if (teacher) {
        teacherInfo = { id: teacher._id, email: teacher.email };
      }
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        teacherId: user.teacherId || null,
        teacher: teacherInfo,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    let teacherInfo = null;
    if (req.user.role === 'student' && req.user.teacherId) {
      const teacher = await User.findById(req.user.teacherId).select('email');
      if (teacher) {
        teacherInfo = { id: teacher._id, email: teacher.email };
      }
    }

    return res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        teacherId: req.user.teacherId || null,
        teacher: teacherInfo,
      },
    });
  } catch (error) {
    next(error);
  }
});
// ===============================
// Get All Teachers (for signup)
// ===============================
router.get('/teachers-list', async (req, res, next) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('_id email');
    return res.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
});

// ===============================
// Get students assigned to teacher
// ===============================
router.get('/students-of-teacher', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers can view their students'
      });
    }

    const students = await User.find({ teacherId: req.user._id })
      .select('_id email');

    return res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
