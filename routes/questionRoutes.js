import express from 'express';
import {getProjectQuestions, askQuestion, answerQuestion} from '../controllers/questionController.js';
import { protect, viewerOrAdmin, reviewerOrAdmin } from '../middleware/authMiddleware.js';

const router= express.Router();

// Only viewers and admins can ask questions
router.post('/', protect, viewerOrAdmin, askQuestion);

// Only reviewers and admins can answer questions  
router.put('/:questionId', protect, reviewerOrAdmin, answerQuestion);

// Everyone can view questions (no auth required)
router.get('/:projectId', getProjectQuestions);

export default router;