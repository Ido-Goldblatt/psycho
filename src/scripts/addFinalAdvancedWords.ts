const finalAdvancedWordsSet1 = [
  {
    english: "Ekphrasis",
    hebrew: "תיאור מילולי של יצירת אמנות",
    example: "The poem was an ekphrasis of the ancient vase.",
    category: "Art",
    difficulty: "hard"
  },
  {
    english: "Elegiac",
    hebrew: "קינתי, נוגה",
    example: "The elegiac tone of the poem reflected the poet's grief.",
    category: "Literature",
    difficulty: "hard"
  },
  {
    english: "Elision",
    hebrew: "השמטה",
    example: "The elision of syllables is common in casual speech.",
    category: "Language",
    difficulty: "hard"
  },
  {
    english: "Emendation",
    hebrew: "תיקון טקסט",
    example: "The scholar suggested an emendation to the ancient manuscript.",
    category: "Writing",
    difficulty: "hard"
  },
  {
    english: "Encomium",
    hebrew: "דברי שבח",
    example: "The graduation speech was an encomium to the retiring professor.",
    category: "Speech",
    difficulty: "hard"
  },
  {
    english: "Ennui",
    hebrew: "שעמום, תשישות נפשית",
    example: "The endless meetings led to a sense of ennui among the staff.",
    category: "Emotion",
    difficulty: "hard"
  },
  {
    english: "Entelechy",
    hebrew: "מימוש עצמי מלא",
    example: "The artist achieved entelechy through her masterpiece.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Epistemology",
    hebrew: "תורת ההכרה",
    example: "The course explored the epistemology of scientific knowledge.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Equanimity",
    hebrew: "שלוות נפש",
    example: "She maintained her equanimity despite the crisis.",
    category: "Emotion",
    difficulty: "hard"
  },
  {
    english: "Eristic",
    hebrew: "מתווכח, פולמוסי",
    example: "The debate devolved into eristic arguments.",
    category: "Communication",
    difficulty: "hard"
  }
];

const finalAdvancedWordsSet2 = [
  {
    english: "Esemplastic",
    hebrew: "מאחד לשלם",
    example: "The artist's esemplastic power unified diverse elements into a cohesive whole.",
    category: "Art",
    difficulty: "hard"
  },
  {
    english: "Etiolate",
    hebrew: "להחוויר, להחליש",
    example: "The plants began to etiolate from lack of sunlight.",
    category: "Biology",
    difficulty: "hard"
  },
  {
    english: "Euhemerism",
    hebrew: "פירוש מיתוסים כאירועים היסטוריים",
    example: "The scholar applied euhemerism to ancient Greek myths.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Extrapolation",
    hebrew: "הסקה, חיזוי",
    example: "The forecast was based on extrapolation from current trends.",
    category: "Logic",
    difficulty: "hard"
  },
  {
    english: "Farrago",
    hebrew: "תערובת מבולבלת",
    example: "The book was a farrago of unrelated ideas.",
    category: "Description",
    difficulty: "hard"
  },
  {
    english: "Fatidic",
    hebrew: "נבואי",
    example: "Her fatidic warning proved accurate.",
    category: "Prophecy",
    difficulty: "hard"
  },
  {
    english: "Felicitous",
    hebrew: "מוצלח, קולע",
    example: "The speaker made a felicitous choice of words.",
    category: "Language",
    difficulty: "hard"
  },
  {
    english: "Flocculent",
    hebrew: "צמרירי, פתיתי",
    example: "The chemical solution became flocculent when mixed.",
    category: "Science",
    difficulty: "hard"
  },
  {
    english: "Folderol",
    hebrew: "שטויות, הבל",
    example: "He dismissed the superstition as mere folderol.",
    category: "Description",
    difficulty: "hard"
  },
  {
    english: "Frangible",
    hebrew: "שביר",
    example: "The frangible container broke on impact.",
    category: "Physical",
    difficulty: "hard"
  }
];

const finalAdvancedWordsSet3 = [
  {
    english: "Fugacious",
    hebrew: "חולף, ארעי",
    example: "Beauty is often fugacious in nature.",
    category: "Time",
    difficulty: "hard"
  },
  {
    english: "Fulsome",
    hebrew: "מוגזם, מתחנף",
    example: "The review was full of fulsome praise.",
    category: "Description",
    difficulty: "hard"
  },
  {
    english: "Galvanic",
    hebrew: "מעורר, מזעזע",
    example: "The news had a galvanic effect on the market.",
    category: "Effect",
    difficulty: "hard"
  },
  {
    english: "Gesamtkunstwerk",
    hebrew: "יצירת אמנות כוללת",
    example: "Wagner's operas aimed to be a gesamtkunstwerk, combining music, drama, and visual arts.",
    category: "Art",
    difficulty: "hard"
  },
  {
    english: "Glossolalia",
    hebrew: "דיבור בלשונות",
    example: "The religious ceremony included instances of glossolalia.",
    category: "Religion",
    difficulty: "hard"
  }
];

async function addWords() {
  try {
    // First batch
    const response1 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalAdvancedWordsSet1),
    });
    console.log("Added first batch:", await response1.json());

    // Second batch
    const response2 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalAdvancedWordsSet2),
    });
    console.log("Added second batch:", await response2.json());

    // Third batch
    const response3 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalAdvancedWordsSet3),
    });
    console.log("Added third batch:", await response3.json());

  } catch (error) {
    console.error("Error adding words:", error);
  }
}

// Run the function
addWords(); 