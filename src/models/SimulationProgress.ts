import mongoose from 'mongoose';

const SimulationProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answers: {
    type: Map,
    of: Number,
    required: true,
  },
  timeSpent: {
    type: Number, // in seconds
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.models.SimulationProgress || mongoose.model('SimulationProgress', SimulationProgressSchema); 