import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Word from '@/models/Word';

const sampleWords = [
  {
    english: 'Ephemeral',
    hebrew: 'חולף, זמני',
    example: 'Social media trends are often ephemeral, lasting only a few days.',
    category: 'Time & Duration',
    difficulty: 'hard'
  },
  {
    english: 'Pragmatic',
    hebrew: 'מעשי, תכליתי',
    example: 'We need a pragmatic approach to solve this problem.',
    category: 'Personality',
    difficulty: 'medium'
  },
  {
    english: 'Ambiguous',
    hebrew: 'דו-משמעי, לא ברור',
    example: 'The contract terms were ambiguous and needed clarification.',
    category: 'Description',
    difficulty: 'medium'
  },
  {
    english: 'Resilient',
    hebrew: 'חסין, עמיד',
    example: 'The human spirit is remarkably resilient in times of adversity.',
    category: 'Personality',
    difficulty: 'medium'
  },
  {
    english: 'Serendipity',
    hebrew: 'מקריות מוצלחת',
    example: 'Meeting my best friend was pure serendipity.',
    category: 'Events',
    difficulty: 'hard'
  }
];

const advancedWords = [
  {
    english: 'Absquatulate',
    hebrew: 'להסתלק, לברוח',
    example: 'The thief absquatulated with the stolen goods before anyone noticed.',
    category: 'Action',
    difficulty: 'hard'
  },
  {
    english: 'Acatalepsy',
    hebrew: 'חוסר יכולת להבין לחלוטין',
    example: 'The philosopher argued that acatalepsy is inherent in our understanding of consciousness.',
    category: 'Philosophy',
    difficulty: 'hard'
  },
  {
    english: 'Agglutination',
    hebrew: 'הדבקה, צירוף',
    example: 'The agglutination of morphemes is a common feature in Turkish language.',
    category: 'Linguistics',
    difficulty: 'hard'
  },
  {
    english: 'Anfractuosity',
    hebrew: 'פיתוליות, עקמומיות',
    example: 'The anfractuosity of the mountain path made the journey twice as long.',
    category: 'Description',
    difficulty: 'hard'
  },
  {
    english: 'Antediluvian',
    hebrew: 'קדום מאוד, מיושן',
    example: 'His antediluvian views on technology were out of place in the modern office.',
    category: 'Time',
    difficulty: 'hard'
  },
  {
    english: 'Apocryphal',
    hebrew: 'מפוקפק, לא אמין',
    example: `The apocryphal story about the company's founding has been repeated so often it's taken as truth.`,
    category: 'Description',
    difficulty: 'hard'
  },
  {
    english: 'Apotheosis',
    hebrew: 'התגלמות מושלמת, האלהה',
    example: 'The Taj Mahal is considered the apotheosis of Mughal architecture.',
    category: 'Concept',
    difficulty: 'hard'
  },
  {
    english: 'Assiduity',
    hebrew: 'התמדה, חריצות',
    example: 'Her assiduity in studying languages impressed all her teachers.',
    category: 'Quality',
    difficulty: 'hard'
  },
  {
    english: 'Ataraxia',
    hebrew: 'שלווה נפשית, רוגע',
    example: 'The philosopher sought ataraxia through meditation and simple living.',
    category: 'State',
    difficulty: 'hard'
  },
  {
    english: 'Casuistry',
    hebrew: 'פלפול, התחכמות',
    example: 'His casuistry in defending the indefensible position was remarkable but unconvincing.',
    category: 'Logic',
    difficulty: 'hard'
  },
  {
    english: 'Demiurge',
    hebrew: 'בורא העולם, יוצר',
    example: 'In Gnostic traditions, the demiurge is considered the creator of the material world.',
    category: 'Philosophy',
    difficulty: 'hard'
  },
  {
    english: 'Epiphenomenal',
    hebrew: 'תופעת לוואי, משני',
    example: 'Some philosophers argue that consciousness is merely epiphenomenal to brain activity.',
    category: 'Philosophy',
    difficulty: 'hard'
  },
  {
    english: 'Logomachy',
    hebrew: 'ויכוח על מילים',
    example: 'The academic debate devolved into mere logomachy about terminology.',
    category: 'Discourse',
    difficulty: 'hard'
  },
  {
    english: 'Palliative',
    hebrew: 'מקל, מרגיע',
    example: 'The treatment was palliative rather than curative.',
    category: 'Medicine',
    difficulty: 'hard'
  },
  {
    english: 'Solipsism',
    hebrew: 'אמונה שרק העצמי קיים',
    example: 'His philosophical arguments often bordered on solipsism.',
    category: 'Philosophy',
    difficulty: 'hard'
  }
];

export async function GET(request: Request) {
  try {
    console.log('Connecting to DB...');
    await connectDB();
    console.log('Connected to DB successfully');
    
    // Get page and limit from query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    console.log('Query params:', { page, limit, skip });

    // Get total count and paginated words that are due for review
    const query = {
      $or: [
        { status: { $in: ['new', null] } },
        { nextReviewDate: { $lte: new Date() } }
      ]
    };

    console.log('Executing query:', JSON.stringify(query));
    
    // First check if we need to seed the database
    const total = await Word.countDocuments();
    console.log('Total words in DB:', total);
    
    if (total === 0) {
      console.log('No words found, seeding database...');
      const sampleWordsWithDefaults = [...sampleWords, ...advancedWords].map(word => ({
        ...word,
        status: 'new',
        lastReviewed: null,
        nextReviewDate: new Date()
      }));
      
      await Word.insertMany(sampleWordsWithDefaults);
      console.log('Seeded database with words');
    }

    // Now get the paginated results
    const words = await Word.find(query)
      .sort({ nextReviewDate: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    // Get the total count for pagination
    const totalMatchingQuery = await Word.countDocuments(query);
    
    console.log('Returning words:', {
      count: words.length,
      page,
      totalMatchingQuery,
      hasMore: skip + words.length < totalMatchingQuery
    });

    return NextResponse.json({
      words,
      total: totalMatchingQuery,
      page,
      totalPages: Math.ceil(totalMatchingQuery / limit),
      hasMore: skip + words.length < totalMatchingQuery
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Handle single word creation
    if (!Array.isArray(body)) {
      const word = await Word.create({
        english: body.english,
        hebrew: body.hebrew,
        example: body.example,
        category: body.category,
        difficulty: body.difficulty,
      });
      return NextResponse.json(word);
    }
    
    // Handle batch word creation
    const words = await Word.insertMany(body);
    return NextResponse.json(words);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create word(s)' }, { status: 500 });
  }
} 