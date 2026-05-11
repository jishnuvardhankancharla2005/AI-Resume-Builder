import express from 'express';
import { register, login, getUserData, getUserResumes } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/data', protect, getUserData);
router.get('/resumes', protect, getUserResumes);

export default router;
