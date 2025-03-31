import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import Word from '../src/models/Word.js';

// Load environment variables
dotenv.config();

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function insertWords() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'jerusalam.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Add default values for new fields
    const wordsWithDefaults = jsonData.map((word) => ({
      ...word,
      status: 'new',
      lastReviewed: null,
      nextReviewDate: new Date()
    }));

    // Insert all words
    const result = await Word.insertMany(wordsWithDefaults);
    console.log(`Successfully inserted ${result.length} words`);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
insertWords(); 