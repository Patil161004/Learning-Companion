import express from 'express';
import { getChecklist, addChecklistItem, updateChecklistItem, deleteChecklistItem } from '../controllers/checklistController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getChecklist);
router.post('/', auth, addChecklistItem);
router.patch('/:id', auth, updateChecklistItem);
router.delete('/:id', auth, deleteChecklistItem);

export default router;