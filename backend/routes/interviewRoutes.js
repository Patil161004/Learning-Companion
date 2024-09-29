import express from 'express';
import { generateInterview, getInterviewHistory } from '../controllers/interviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', auth, generateInterview);
router.get('/history', auth, getInterviewHistory);

export default router;