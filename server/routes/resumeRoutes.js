import express from 'express';
import multer from 'multer';
import { createResume, updateResume, deleteResume, getResume, uploadResume, aiEnhance, atsScore } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .post(protect, createResume);

router.post('/upload', protect, upload.single('file'), uploadResume);
router.post('/ai-enhance', protect, aiEnhance);
router.post('/ats-score', protect, atsScore);

router.route('/:id')
  .get(getResume) // Public can view if visibility allows, but userController needs protect for update/delete
  .put(protect, upload.single('image'), updateResume)
  .delete(protect, deleteResume);

export default router;
