import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUserRole,
  approveUser,
  deleteUser,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getAllReviews,
  updateReview,
  deleteReview,
  getAllQuestions,
  deleteQuestion
} from '../controllers/adminControllers.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

//==================================User Management Routes==================================
router.get('/users', protect, admin, getAllUsers);
router.post('/users', protect, admin, createUser);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.put('/users/:id/approve', protect, admin, approveUser);
router.delete('/users/:id', protect, admin, deleteUser);

//==================================Project Management Routes==================================
router.get('/projects', protect, admin, getAllProjects);
router.post('/projects', protect, admin, createProject);
router.put('/projects/:id', protect, admin, updateProject);
router.delete('/projects/:id', protect, admin, deleteProject);

//==================================Review Management Routes==================================
router.get('/reviews', protect, admin, getAllReviews);
router.put('/reviews/:id', protect, admin, updateReview);
router.delete('/reviews/:id', protect, admin, deleteReview);

//==================================Q&A Management Routes==================================
router.get('/questions', protect, admin, getAllQuestions);
router.delete('/questions/:id', protect, admin, deleteQuestion);

export default router;
