import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['learned', 'in_progress', 'not_started'],
    default: 'not_started',
  },
  nextReview: {
    type: Date,
    default: null,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema); 