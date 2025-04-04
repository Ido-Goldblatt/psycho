import mongoose from 'mongoose';

const ErrorSchema = new mongoose.Schema({
  statusCode: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  stack: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed,
  },
  queryParams: {
    type: mongoose.Schema.Types.Mixed,
  },
  headers: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
ErrorSchema.index({ statusCode: 1, createdAt: -1 });
ErrorSchema.index({ path: 1, createdAt: -1 });

// Only create the model if we're not in middleware
const isMiddleware = typeof window === 'undefined' && process.env.NEXT_RUNTIME === 'edge';

const ErrorModel = !isMiddleware
  ? mongoose.models.Error || mongoose.model('Error', ErrorSchema)
  : null;


export default ErrorModel; 