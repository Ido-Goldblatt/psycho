import mongoose, { Schema, Document } from 'mongoose';

// Interface for the question options
interface IQuestionOption {
  text: string;
  value: string;
}

// Interface for individual questions
interface IQuestion {
  question: string;
  options: IQuestionOption[];
  answer: string;
}

// Interface for the main document
export interface IUnseenEnglishQuestion extends Document {
  passage: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const UnseenEnglishQuestionSchema = new Schema<IUnseenEnglishQuestion>(
  {
    passage: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [{
      question: {
        type: String,
        required: true,
        trim: true,
      },
      options: [{
        text: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
      }],
      answer: {
        type: String,
        required: true,
        trim: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const UnseenEnglishQuestion = mongoose.models.UnseenEnglishQuestion || 
  mongoose.model<IUnseenEnglishQuestion>('UnseenEnglishQuestion', UnseenEnglishQuestionSchema); 