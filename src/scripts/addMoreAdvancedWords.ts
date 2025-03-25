const moreAdvancedWordsSet1 = [
  {
    english: "Callipygian",
    hebrew: "בעל ישבן יפה",
    example: "The ancient Greek statue was known for its callipygian features.",
    category: "Anatomy",
    difficulty: "hard"
  },
  {
    english: "Catafalque",
    hebrew: "במת אבל",
    example: "The leader's body lay in state on an ornate catafalque.",
    category: "Ceremony",
    difficulty: "hard"
  },
  {
    english: "Cathexis",
    hebrew: "השקעה רגשית",
    example: "The patient's cathexis to childhood objects was a focus of therapy.",
    category: "Psychology",
    difficulty: "hard"
  },
  {
    english: "Chiasmus",
    hebrew: "היפוך מילים",
    example: "'Ask not what your country can do for you, ask what you can do for your country' is a famous chiasmus.",
    category: "Language",
    difficulty: "hard"
  },
  {
    english: "Cicatrize",
    hebrew: "להצטלק",
    example: "The wound began to cicatrize after proper treatment.",
    category: "Medical",
    difficulty: "hard"
  },
  {
    english: "Clerisy",
    hebrew: "האליטה המשכילה",
    example: "The clerisy often gathered to discuss philosophical matters.",
    category: "Society",
    difficulty: "hard"
  },
  {
    english: "Commensurate",
    hebrew: "תואם, מתאים",
    example: "The salary was commensurate with his experience.",
    category: "Measurement",
    difficulty: "hard"
  },
  {
    english: "Compendious",
    hebrew: "תמציתי, מקיף",
    example: "The book provided a compendious overview of world history.",
    category: "Description",
    difficulty: "hard"
  },
  {
    english: "Concatenation",
    hebrew: "שרשור, רצף",
    example: "The events formed a concatenation leading to the final outcome.",
    category: "Logic",
    difficulty: "hard"
  },
  {
    english: "Concomitant",
    hebrew: "נלווה, מתלווה",
    example: "Headaches were a concomitant symptom of the condition.",
    category: "Medical",
    difficulty: "hard"
  }
];

const moreAdvancedWordsSet2 = [
  {
    english: "Conflate",
    hebrew: "לערבב, למזג",
    example: "People often conflate correlation with causation.",
    category: "Logic",
    difficulty: "hard"
  },
  {
    english: "Corpuscular",
    hebrew: "גרגירי, חלקיקי",
    example: "Newton proposed a corpuscular theory of light.",
    category: "Science",
    difficulty: "hard"
  },
  {
    english: "Crepuscular",
    hebrew: "של בין ערביים",
    example: "Many animals are crepuscular, active at dawn and dusk.",
    category: "Nature",
    difficulty: "hard"
  },
  {
    english: "Cynosure",
    hebrew: "מוקד התעניינות",
    example: "The new building became the cynosure of the city center.",
    category: "Attention",
    difficulty: "hard"
  },
  {
    english: "Deipnosophist",
    hebrew: "מומחה לשיחות שולחן",
    example: "As a renowned deipnosophist, he kept dinner parties lively with his wit.",
    category: "Society",
    difficulty: "hard"
  },
  {
    english: "Denouement",
    hebrew: "סיום, התרה",
    example: "The novel's denouement tied up all the loose plot threads.",
    category: "Literature",
    difficulty: "hard"
  },
  {
    english: "Deterritorialization",
    hebrew: "הפקעת טריטוריה",
    example: "Globalization has led to cultural deterritorialization.",
    category: "Society",
    difficulty: "hard"
  },
  {
    english: "Diacritical",
    hebrew: "סימן הבחנה",
    example: "The diacritical marks help indicate proper pronunciation.",
    category: "Language",
    difficulty: "hard"
  },
  {
    english: "Diaphanous",
    hebrew: "שקוף למחצה",
    example: "The diaphanous curtains filtered the sunlight.",
    category: "Description",
    difficulty: "hard"
  },
  {
    english: "Discursive",
    hebrew: "מתפתל, משוטט",
    example: "His discursive writing style covered many tangential topics.",
    category: "Writing",
    difficulty: "hard"
  }
];

const moreAdvancedWordsSet3 = [
  {
    english: "Dissimulation",
    hebrew: "העמדת פנים",
    example: "Her calm exterior was a dissimulation of her inner turmoil.",
    category: "Behavior",
    difficulty: "hard"
  },
  {
    english: "Doyen",
    hebrew: "זקן החבורה, מומחה ותיק",
    example: "He was considered the doyen of modern architecture.",
    category: "Status",
    difficulty: "hard"
  },
  {
    english: "Echolalia",
    hebrew: "חזרה על מילים",
    example: "The patient exhibited echolalia, repeating everything said to him.",
    category: "Medical",
    difficulty: "hard"
  },
  {
    english: "Ecphrasis",
    hebrew: "תיאור אמנותי",
    example: "The poem was an ecphrasis of the famous painting.",
    category: "Art",
    difficulty: "hard"
  },
  {
    english: "Edification",
    hebrew: "חינוך מוסרי",
    example: "The story was written for the edification of young readers.",
    category: "Education",
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
      body: JSON.stringify(moreAdvancedWordsSet1),
    });
    console.log("Added first batch:", await response1.json());

    // Second batch
    const response2 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moreAdvancedWordsSet2),
    });
    console.log("Added second batch:", await response2.json());

    // Third batch
    const response3 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moreAdvancedWordsSet3),
    });
    console.log("Added third batch:", await response3.json());

  } catch (error) {
    console.error("Error adding words:", error);
  }
}

// Run the function
addWords(); 