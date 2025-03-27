const exampleData = {
  passage: "In today's world of digital transactions, many people wonder why physical currency is still used. Indeed, with the rise of credit cards and mobile payments, one might expect cash to become obsolete. However, despite these advancements, cash remains an essential part of the economy. Some businesses still operate primarily with cash, and many people prefer it for privacy and budgeting purposes. Surprisingly, there are even places where cash transactions are the only option available.\n\nOne of the most unique places where cash is still dominant is the Floating Market in Thailand. Located on a river, vendors sell goods directly from their boats, making it an iconic tourist attraction. Many of these sellers only accept cash, as handling electronic payments in such a setting is impractical. Visitors come from around the world to experience this market, enjoying the fresh produce, traditional crafts, and delicious street food.\n\nAnother location where cash remains king is the La Rinconada settlement in Peru. This remote mining town, situated high in the Andes, operates largely on a cash-based economy. Due to its extreme altitude and lack of banking infrastructure, digital payments are nearly impossible. Miners and shopkeepers rely on cash transactions, reinforcing its continued importance in such isolated communities.",
  questions: [
    {
      question: "What do the two locations described in the text have in common?",
      options: [
        "1. They are modern financial centers.",
        "2. They provide a unique experience.",
        "3. They rely solely on digital payments.",
        "4. They have a strict banking system."
      ],
      answer: "2"
    },
    {
      question: "In line 3, \"become obsolete\" is closest in meaning to:",
      options: [
        "1. Improve significantly",
        "2. No longer exist",
        "3. Spread to new areas",
        "4. Change in appearance"
      ],
      answer: "2"
    },
    {
      question: "The main purpose of the second paragraph is to describe:",
      options: [
        "1. The Floating Market in Thailand",
        "2. Some tourist attractions in Thailand",
        "3. The smallest marketplace in the world",
        "4. A place where digital payments are common"
      ],
      answer: "1"
    },
    {
      question: "It can be inferred that the Floating Market offers tourists the opportunity to:",
      options: [
        "1. Learn how to use mobile payments",
        "2. Buy electronic devices",
        "3. Visit many countries",
        "4. Experience traditional commerce"
      ],
      answer: "4"
    },
    {
      question: "Based on the information in the last paragraph, which of the following statements about La Rinconada is true?",
      options: [
        "1. It is difficult to find people willing to live there.",
        "2. Workers earn high salaries.",
        "3. The town has a well-developed banking system.",
        "4. Cash transactions are essential due to limited infrastructure."
      ],
      answer: "4"
    }
  ]
};

async function saveExample() {
  try {
    const response = await fetch('http://localhost:3000/api/unseen-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exampleData),
    });

    const data = await response.json();
    console.log('Successfully saved example:', data);
  } catch (error) {
    console.error('Error saving example:', error);
  }
}

saveExample(); 