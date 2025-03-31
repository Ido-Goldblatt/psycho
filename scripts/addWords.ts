import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(process.cwd(), 'jerusalam.json');

async function addWords() {
  try {
    // Read the JSON file
    const jsonPath = join(process.cwd(), 'jerusalam.json');
    const words = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    // Split words into batches of 50 to avoid large payload
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < words.length; i += batchSize) {
      batches.push(words.slice(i, i + batchSize));
    }

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const response = await fetch("http://localhost:3000/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ words: batches[i] }),
      });

      const result = await response.json();
      console.log(`Added batch ${i + 1}/${batches.length}:`, result);
    }

    console.log('All words have been added successfully!');

  } catch (error) {
    console.error("Error adding words:", error);
  }
}

// Run the function
addWords(); 