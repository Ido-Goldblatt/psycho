import mongoose from 'mongoose';

const timeSpentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSpent: {
    type: Number, // Time in seconds
    required: true,
    default: 0
  },
  lastActive: {
    type: Date,
    required: true
  }
});

// Create a compound index for efficient querying
timeSpentSchema.index({ userId: 1, date: 1 }, { unique: true });

const TimeSpent = mongoose.models.TimeSpent || mongoose.model('TimeSpent', timeSpentSchema);

export default TimeSpent; 