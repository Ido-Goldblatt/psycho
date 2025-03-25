import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  english: {
    type: String,
    required: true,
  },
  hebrew: {
    type: String,
    required: true,
  },
  example: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Word || mongoose.model('Word', WordSchema); 