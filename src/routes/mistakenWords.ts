import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import MistakenWord from '@/models/MistakenWord';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  await connectToDatabase();

  switch (req.method) {
    case 'POST':
      try {
        const { wordId, word, correctAnswer, userAnswer, quizType } = req.body;

        // Check if this word was already marked as mistaken for this user
        const existingMistake = await MistakenWord.findOne({
          userId: decoded.userId,
          wordId: wordId
        });

        if (existingMistake) {
          // Update attempts count
          existingMistake.attempts += 1;
          existingMistake.timestamp = new Date();
          await existingMistake.save();
          return res.status(200).json(existingMistake);
        }

        // Create new mistaken word entry
        const mistakenWord = await MistakenWord.create({
          userId: decoded.userId,
          wordId,
          word,
          correctAnswer,
          userAnswer,
          quizType,
          attempts: 1
        });

        return res.status(201).json(mistakenWord);
      } catch (error) {
        console.error('Error adding mistaken word:', error);
        return res.status(500).json({ error: 'Failed to add mistaken word' });
      }

    case 'GET':
      try {
        const mistakenWords = await MistakenWord.find({
          userId: decoded.userId
        })
          .sort({ timestamp: -1 })
          .limit(50);

        return res.status(200).json(mistakenWords);
      } catch (error) {
        console.error('Error fetching mistaken words:', error);
        return res.status(500).json({ error: 'Failed to fetch mistaken words' });
      }

    case 'DELETE':
      try {
        const { wordId } = req.query;
        
        if (!wordId) {
          return res.status(400).json({ error: 'Word ID is required' });
        }

        await MistakenWord.findOneAndDelete({
          userId: decoded.userId,
          wordId: wordId
        });

        return res.status(200).json({ message: 'Mistaken word removed successfully' });
      } catch (error) {
        console.error('Error deleting mistaken word:', error);
        return res.status(500).json({ error: 'Failed to delete mistaken word' });
      }

    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 