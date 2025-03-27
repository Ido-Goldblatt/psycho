import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const unseenTextSchema = new mongoose.Schema({
  passage: {
    type: String,
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
unseenTextSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UnseenText = mongoose.models.UnseenText || mongoose.model('UnseenText', unseenTextSchema); 