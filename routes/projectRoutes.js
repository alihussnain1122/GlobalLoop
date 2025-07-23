import express, { Router } from 'express';
import { getAllProjects, createProject, updateProjectById, getProjectById, deleteProjectById } 
from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router= express.Router();

router.post('/', protect, createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProjectById);
router.delete('/:id', protect, deleteProjectById);

export default router;
