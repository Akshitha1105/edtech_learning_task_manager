const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const taskCreateValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().toDate(),
  body('progress').optional().isIn(['not-started', 'in-progress', 'completed']),
];

const taskUpdateValidator = [
  param('id').isMongoId().withMessage('Invalid task id'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().toDate(),
  body('progress').optional().isIn(['not-started', 'in-progress', 'completed']),
];

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.userId = req.user._id;
    } else if (req.user.role === 'teacher') {
      const students = await User.find({ teacherId: req.user._id }).select('_id');
      const studentIds = students.map((s) => s._id);

      query.$or = [{ userId: req.user._id }, { userId: { $in: studentIds } }];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
});

router.post('/', taskCreateValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { title, description, dueDate, progress } = req.body;

    // Teacher must choose a student
let targetUserId = req.user._id;

if (req.user.role === "teacher") {
  if (!req.body.studentId) {
    return res.status(400).json({
      success: false,
      message: "Teacher must select a student"
    });
  }

  targetUserId = req.body.studentId;
}

const task = await Task.create({
  userId: targetUserId,
  title,
  description: description || '',
  dueDate: dueDate || null,
  progress: progress || 'not-started',
});


    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', taskUpdateValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, dueDate, progress } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (progress !== undefined) task.progress = progress;

    await task.save();

    return res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid task id')], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    return res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
