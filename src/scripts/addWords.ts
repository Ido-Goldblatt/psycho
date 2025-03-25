const remainingWords = [
  {
    english: "Brachylogy",
    hebrew: "קיצור לשון",
    example: "His writing style favors brachylogy, often omitting unnecessary words.",
    category: "Linguistics",
    difficulty: "hard"
  },
  {
    english: "Cacophemism",
    hebrew: "שימוש במילים גסות",
    example: "The critic's review was full of cacophemisms about the performance.",
    category: "Language",
    difficulty: "hard"
  },
  {
    english: "Celerity",
    hebrew: "מהירות, זריזות",
    example: "The emergency response team acted with remarkable celerity.",
    category: "Quality",
    difficulty: "hard"
  },
  {
    english: "Chthonic",
    hebrew: "תת-קרקעי, שאולי",
    example: "The novel explores chthonic deities in ancient Greek mythology.",
    category: "Mythology",
    difficulty: "hard"
  },
  {
    english: "Concupiscence",
    hebrew: "תאווה, תשוקה",
    example: "The sermon warned against the dangers of concupiscence.",
    category: "Emotion",
    difficulty: "hard"
  },
  {
    english: "Deliquescence",
    hebrew: "התמוססות, המסה",
    example: "The deliquescence of the salt occurred due to high humidity.",
    category: "Science",
    difficulty: "hard"
  },
  {
    english: "Diachronic",
    hebrew: "התפתחותי, היסטורי",
    example: "A diachronic study of language shows how words evolve over time.",
    category: "Time",
    difficulty: "hard"
  },
  {
    english: "Dichotomous",
    hebrew: "מפוצל לשניים, דו-ערכי",
    example: "The debate presented a dichotomous choice between peace and war.",
    category: "Logic",
    difficulty: "hard"
  },
  {
    english: "Efflorescence",
    hebrew: "פריחה, שגשוג",
    example: "The Renaissance marked an efflorescence of art and culture in Europe.",
    category: "Development",
    difficulty: "hard"
  },
  {
    english: "Eleemosynary",
    hebrew: "צדקה, נדבה",
    example: "The foundation's eleemosynary activities benefit many charities.",
    category: "Society",
    difficulty: "hard"
  },
  {
    english: "Enthymeme",
    hebrew: "היסק חסר",
    example: "The speaker's argument relied on an enthymeme with an unstated premise.",
    category: "Logic",
    difficulty: "hard"
  },
  {
    english: "Epistolary",
    hebrew: "של מכתבים",
    example: "The epistolary novel tells its story through letters between characters.",
    category: "Literature",
    difficulty: "hard"
  },
  {
    english: "Eremitic",
    hebrew: "נזירי, מתבודד",
    example: "He lived an eremitic lifestyle in a remote mountain cabin.",
    category: "Lifestyle",
    difficulty: "hard"
  },
  {
    english: "Eschatological",
    hebrew: "אחרית הימים",
    example: "The book explores eschatological themes about the end of the world.",
    category: "Religion",
    difficulty: "hard"
  },
  {
    english: "Eudaemonic",
    hebrew: "מביא אושר",
    example: "The philosopher proposed a eudaemonic approach to ethics.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Exegetical",
    hebrew: "פרשני",
    example: "The scholar provided an exegetical analysis of the ancient text.",
    category: "Academic",
    difficulty: "hard"
  },
  {
    english: "Expatiate",
    hebrew: "להרחיב, לפרט",
    example: "The professor would often expatiate on his favorite topics.",
    category: "Communication",
    difficulty: "hard"
  },
  {
    english: "Febrile",
    hebrew: "קודח, נרגש",
    example: "The patient displayed febrile symptoms.",
    category: "Medical",
    difficulty: "hard"
  },
  {
    english: "Fecundity",
    hebrew: "פוריות, יצרנות",
    example: "The artist's fecundity was evident in his numerous works.",
    category: "Quality",
    difficulty: "hard"
  },
  {
    english: "Garrulous",
    hebrew: "פטפטן, מרבה לדבר",
    example: "The garrulous neighbor would talk for hours about nothing in particular.",
    category: "Personality",
    difficulty: "hard"
  }
];

const moreWords = [
  {
    english: "Haecceity",
    hebrew: "מהות ייחודית",
    example: "The philosopher discussed the haecceity that makes each person unique.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Hegemonic",
    hebrew: "שולט, דומיננטי",
    example: "The country maintained its hegemonic position in the region.",
    category: "Politics",
    difficulty: "hard"
  },
  {
    english: "Heteroclitic",
    hebrew: "חריג, יוצא דופן",
    example: "His heteroclitic approach to painting challenged traditional methods.",
    category: "Art",
    difficulty: "hard"
  },
  {
    english: "Holophrase",
    hebrew: "מילה-משפט",
    example: "Young children often use holophrases to express complete thoughts.",
    category: "Linguistics",
    difficulty: "hard"
  },
  {
    english: "Homiletic",
    hebrew: "של דרשה",
    example: "The priest's homiletic style made his sermons engaging.",
    category: "Religion",
    difficulty: "hard"
  }
];

const finalWords = [
  {
    english: "Hypostasis",
    hebrew: "מהות, התגלמות",
    example: "The concept represents the hypostasis of truth in physical form.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Inenarrable",
    hebrew: "בלתי ניתן לתיאור",
    example: "The beauty of the sunset was inenarrable.",
    category: "Description",
    difficulty: "hard"
  },
  {
    english: "Interpellation",
    hebrew: "פנייה, קריאה",
    example: "The theory discusses ideological interpellation in modern society.",
    category: "Sociology",
    difficulty: "hard"
  },
  {
    english: "Ipseity",
    hebrew: "זהות עצמית",
    example: "The philosopher explored the concept of ipseity in human consciousness.",
    category: "Philosophy",
    difficulty: "hard"
  },
  {
    english: "Isomorph",
    hebrew: "שווה צורה",
    example: "The two structures are isomorphs of each other.",
    category: "Mathematics",
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
      body: JSON.stringify(remainingWords),
    });
    console.log("Added first batch:", await response1.json());

    // Second batch
    const response2 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moreWords),
    });
    console.log("Added second batch:", await response2.json());

    // Third batch
    const response3 = await fetch("http://localhost:3000/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalWords),
    });
    console.log("Added third batch:", await response3.json());

  } catch (error) {
    console.error("Error adding words:", error);
  }
}

// Run the function
addWords(); 