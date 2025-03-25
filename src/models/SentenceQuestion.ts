import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const SentenceQuestionSchema = new mongoose.Schema({
  beforeBlank: {
    type: String,
    required: true,
  },
  afterBlank: {
    type: String,
    required: true,
  },
  options: {
    type: [OptionSchema],
    required: true,
    validate: [
      {
        validator: function(options: any[]) {
          return options.length >= 2; // At least 2 options required
        },
        message: 'At least 2 options are required'
      }
    ]
  },
  correctOptionId: {
    type: Number,
    required: true,
    validate: {
      validator: function(value: number) {
        return this.options.some((opt: any) => opt.id === value);
      },
      message: 'Correct option ID must match one of the provided options'
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.SentenceQuestion || mongoose.model('SentenceQuestion', SentenceQuestionSchema); 