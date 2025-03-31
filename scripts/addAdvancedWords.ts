const advancedWordsSet1 = [
  {
    english: "Abecedarian",
    hebrew: "אלפביתי, בסיסי",
    example: "The abecedarian approach to learning starts with the basics of the alphabet.",
    category: "Education",
    difficulty: "hard"
  },
  {
    english: "Abscission",
    hebrew: "נשירה, ניתוק",
    example: "The abscission of leaves in autumn is a natural process.",
    category: "Biology",
    difficulty: "hard"
  },
  {
    english: "Acerbic",
    hebrew: "חריף, נוקב",
    example: "The critic was known for his acerbic reviews of new films.",
    category: "Personality",
    difficulty: "hard"
  },
  {
    english: "Achromatic",
    hebrew: "חסר צבע",
    example: "The achromatic design used only black, white, and grays.",
    category: "Art",
    difficulty: "hard"
  },
  {
    english: "Acumen",
    hebrew: "חריפות שכל, תבונה",
    example: "Her business acumen led to the company's rapid growth.",
    category: "Intelligence",
    difficulty: "hard"
  },
  {
    english: "Adumbrate",
    hebrew: "לרמוז, לתאר בקווים כלליים",
    example: "The professor adumbrated the main themes of the course in the first lecture.",
    category: "Communication",
    difficulty: "hard"
  },
  {
    english: "Aetiology",
    hebrew: "חקר הסיבות",
    example: "The aetiology of the disease remains unknown.",
    category: "Science",
    difficulty: "hard"
  },
  {
    english: "Afflatus",
    hebrew: "השראה אלוהית",
    example: "The poet claimed divine afflatus for his latest work.",
    category: "Art",
    difficulty: "hard"
  },
  {
    english: "Agathokakological",
    hebrew: "המורכב מטוב ורע",
    example: "Human nature is often described as agathokakological.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Alacrity",
    hebrew: "זריזות, התלהבות",
    example: "She accepted the challenge with alacrity.",
    category: "Behavior",
    difficulty: "hard"
  }
];

const advancedWordsSet2 = [
  {
    english: "Anamnesis",
    hebrew: "זיכרון, היזכרות",
    example: "The therapy session focused on anamnesis of childhood events.",
    category: "Psychology",
    difficulty: "hard"
  },
  {
    english: "Anomie",
    hebrew: "חוסר נורמות חברתיות",
    example: "The collapse of social institutions led to a state of anomie.",
    category: "Sociology",
    difficulty: "hard"
  },
  {
    english: "Antipraxis",
    hebrew: "פעולה מנוגדת",
    example: "His behavior was an antipraxis to social norms.",
    category: "Behavior",
    difficulty: "hard"
  },
  {
    english: "Aporia",
    hebrew: "מבוי סתום פילוסופי",
    example: "The philosopher encountered an aporia in his logical argument.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Arboreal",
    hebrew: "של עצים, עצי",
    example: "The koala's arboreal lifestyle is perfectly suited to eucalyptus forests.",
    category: "Nature",
    difficulty: "hard"
  },
  {
    english: "Argot",
    hebrew: "סלנג, ניב מקצועי",
    example: "The thieves used their own argot to communicate secretly.",
    category: "Language",
    difficulty: "hard"
  },
  {
    english: "Arraignment",
    hebrew: "הגשת כתב אישום",
    example: "The suspect's arraignment was scheduled for Monday morning.",
    category: "Law",
    difficulty: "hard"
  },
  {
    english: "Asseverate",
    hebrew: "להצהיר בתוקף",
    example: "He asseverated his innocence despite the evidence.",
    category: "Communication",
    difficulty: "hard"
  },
  {
    english: "Astringent",
    hebrew: "מכווץ, חריף",
    example: "The wine had an astringent taste that puckered the mouth.",
    category: "Sensation",
    difficulty: "hard"
  },
  {
    english: "Axiomatic",
    hebrew: "מובן מאליו",
    example: "It is axiomatic that all living things must die.",
    category: "Logic",
    difficulty: "hard"
  }
];

const advancedWordsSet3 = [
  {
    english: "Bathos",
    hebrew: "מעבר פתאומי מרצינות לגיחוך",
    example: "The speech descended into bathos when he compared world peace to his pet hamster.",
    category: "Literature",
    difficulty: "hard"
  },
  {
    english: "Beatific",
    hebrew: "מאושר, קורן אושר",
    example: "The saint wore a beatific smile as she helped the poor.",
    category: "Emotion",
    difficulty: "hard"
  },
  {
    english: "Bildungsroman",
    hebrew: "רומן חניכה",
    example: "The novel is a classic bildungsroman, following the protagonist's journey to adulthood.",
    category: "Literature",
    difficulty: "hard"
  },
  {
    english: "Brachystochrone",
    hebrew: "עקומת הזמן הקצר ביותר",
    example: "The mathematician calculated the brachystochrone curve for the optimal path.",
    category: "Mathematics",
    difficulty: "hard"
  },
  {
    english: "Cadence",
    hebrew: "מקצב, קצב",
    example: "The poem's cadence mimicked the sound of falling rain.",
    category: "Music",
    difficulty: "hard"
  }
];

async function addAdvancedWords() {
  try {
    // First batch
    const response1 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ words: advancedWordsSet1 }),
    });
    console.log("Added first batch:", await response1.json());

    // Second batch
    const response2 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ words: advancedWordsSet2 }),
    });
    console.log("Added second batch:", await response2.json());

    // Third batch
    const response3 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ words: advancedWordsSet3 }),
    });
    console.log("Added third batch:", await response3.json());

  } catch (error) {
    console.error("Error adding words:", error);
  }
}

// Run the function
addAdvancedWords(); 