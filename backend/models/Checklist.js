import mongoose from 'mongoose';

const checklistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Checklist = mongoose.model('Checklist', checklistSchema);

export default Checklist;