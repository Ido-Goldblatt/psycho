import mongoose, { Schema, Document } from 'mongoose';

export interface IMistakenWord extends Document {
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  word: string;
  correctAnswer: string;
  userAnswer: string;
  quizType: string; // e.g., 'vocabulary', 'sentence', 'unseen'
  timestamp: Date;
  attempts: number;
}

const MistakenWordSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wordId: {
    type: Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  },
  word: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  quizType: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  attempts: {
    type: Number,
    default: 1
  }
});

// Index for efficient querying
MistakenWordSchema.index({ userId: 1, wordId: 1 });

export default mongoose.models.MistakenWord || mongoose.model<IMistakenWord>('MistakenWord', MistakenWordSchema); 