import express from 'express';
import {protect, reviewerOrAdmin} from '../middleware/authMiddleware.js';
import {submitReview, getReviews} from '../controllers/reviewController.js';

const router= express.Router();

// Only reviewers and admins can submit reviews
router.post('/', protect, reviewerOrAdmin, submitReview);

// Everyone can view reviews (no auth required)
router.get('/:projectId', getReviews);

export default router;