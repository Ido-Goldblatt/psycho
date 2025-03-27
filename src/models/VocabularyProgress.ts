import mongoose from 'mongoose';

const VocabularyProgressSchema = new mongoose.Schema({
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
  lastReviewed: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
  collection: 'vocabulary_progress' // Explicitly set collection name
});

export default mongoose.models.VocabularyProgress || mongoose.model('VocabularyProgress', VocabularyProgressSchema); 