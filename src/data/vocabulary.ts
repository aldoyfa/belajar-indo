// Vocabulary data matching the web app
export interface VocabWord {
  word: string;
  meaning: string;
  example: string;
  example_id: string;
}

export interface VocabCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  words: VocabWord[];
}

export const vocabularyData: VocabCategory[] = [
  {
    id: "makanan",
    name: "Food & Drinks",
    icon: "🍽️",
    description: "50+ vocabulary about Indonesian cuisine",
    words: [
      { word: "Nasi", meaning: "Rice", example: "I eat rice every day.", example_id: "Saya makan nasi setiap hari." },
      { word: "Air", meaning: "Water", example: "Drinking water is healthy.", example_id: "Saya minum air putih setiap hari." },
      { word: "Makan", meaning: "Eat", example: "We eat together.", example_id: "Kita makan bersama." },
      { word: "Minum", meaning: "Drink", example: "I drink hot tea.", example_id: "Saya minum teh panas." },
      { word: "Roti", meaning: "Bread", example: "I have bread for breakfast.", example_id: "Saya sarapan roti setiap pagi." },
      { word: "Buah", meaning: "Fruit", example: "Fresh fruit is good for your health.", example_id: "Buah-buahan segar baik untuk kesehatan." },
      { word: "Sayur", meaning: "Vegetable", example: "Eat vegetables every day.", example_id: "Makan sayur setiap hari itu sehat." },
      { word: "Daging", meaning: "Meat", example: "Beef is used for the BBQ.", example_id: "Daging sapi sering digunakan untuk BBQ." },
      { word: "Ikan", meaning: "Fish", example: "Grilled fish is very tasty.", example_id: "Ikan bakar sangat lezat." },
      { word: "Telur", meaning: "Egg", example: "I make an omelet for breakfast.", example_id: "Saya membuat telur dadar untuk sarapan." },
      { word: "Susu", meaning: "Milk", example: "I drink milk before bed.", example_id: "Saya minum susu sebelum tidur." },
      { word: "Keju", meaning: "Cheese", example: "Cheese goes well on toast.", example_id: "Keju enak dipadukan dengan roti bakar." },
      { word: "Gula", meaning: "Sugar", example: "Add a little sugar.", example_id: "Tambahkan sedikit gula." },
      { word: "Garam", meaning: "Salt", example: "Salt is used to season food.", example_id: "Garam dipakai untuk memberi rasa pada masakan." },
      { word: "Kopi", meaning: "Coffee", example: "Morning coffee gives me energy.", example_id: "Kopi pagi memberi saya semangat." },
    ],
  },
  {
    id: "keluarga",
    name: "Family",
    icon: "👨‍👩‍👧‍👦",
    description: "Family members and relationships",
    words: [
      { word: "Ayah", meaning: "Father", example: "Father goes to work.", example_id: "Ayah pergi bekerja." },
      { word: "Ibu", meaning: "Mother", example: "Mother cooks in the kitchen.", example_id: "Ibu memasak di dapur." },
      { word: "Kakak", meaning: "Older sibling", example: "My older sibling is studying.", example_id: "Kakak saya sedang belajar." },
      { word: "Adik", meaning: "Younger sibling", example: "My younger sibling is playing in the park.", example_id: "Adik saya sedang bermain di taman." },
      { word: "Nenek", meaning: "Grandmother", example: "Grandmother tells stories.", example_id: "Nenek bercerita tentang masa lalu." },
      { word: "Kakek", meaning: "Grandfather", example: "Grandfather reads the newspaper.", example_id: "Kakek membaca koran setiap pagi." },
      { word: "Paman", meaning: "Uncle", example: "Uncle came to visit.", example_id: "Paman datang berkunjung." },
      { word: "Bibi", meaning: "Aunt", example: "Aunt brought some gifts.", example_id: "Bibi membawa beberapa hadiah." },
      { word: "Sepupu", meaning: "Cousin", example: "My cousin plays with us.", example_id: "Sepupu saya bermain bersama kami." },
      { word: "Keponakan", meaning: "Nephew/Niece", example: "My niece/nephew is very cute.", example_id: "Keponakan saya sangat lucu." },
      { word: "Suami", meaning: "Husband", example: "The husband left for work.", example_id: "Suami berangkat kerja pagi ini." },
      { word: "Istri", meaning: "Wife", example: "The wife cooks dinner.", example_id: "Istri memasakkan makan malam." },
      { word: "Anak", meaning: "Child", example: "The child plays in the yard.", example_id: "Anak itu bermain di halaman." },
      { word: "Cucu", meaning: "Grandchild", example: "The grandchild visits grandmother.", example_id: "Cucu mengunjungi neneknya." },
      { word: "Keluarga", meaning: "Family", example: "The family gathers at home.", example_id: "Keluarga berkumpul di rumah." },
    ],
  },
  {
    id: "sehari",
    name: "Daily Activities",
    icon: "🏠",
    description: "Everyday activities and routines",
    words: [
      { word: "Belajar", meaning: "Study", example: "I study the Indonesian language.", example_id: "Saya belajar bahasa Indonesia." },
      { word: "Tidur", meaning: "Sleep", example: "Getting enough sleep is important.", example_id: "Saya tidur delapan jam setiap malam." },
      { word: "Bangun", meaning: "Wake up", example: "Waking up early is healthy.", example_id: "Saya bangun pagi setiap hari." },
      { word: "Mandi", meaning: "Bath", example: "Take a shower before leaving.", example_id: "Saya mandi setiap pagi." },
      { word: "Kerja", meaning: "Work", example: "Father goes to work.", example_id: "Ayah pergi bekerja ke kantor." },
      { word: "Sarapan", meaning: "Breakfast", example: "Have breakfast before school.", example_id: "Saya sarapan sebelum berangkat." },
      { word: "Olahraga", meaning: "Exercise", example: "Exercise in the morning.", example_id: "Saya berolahraga setiap pagi." },
      { word: "Membaca", meaning: "Reading", example: "I read a book before bed.", example_id: "Saya membaca buku setiap malam." },
      { word: "Menulis", meaning: "Writing", example: "I write in my diary every day.", example_id: "Saya menulis di buku harian setiap hari." },
      { word: "Bermain", meaning: "Playing", example: "Play with friends.", example_id: "Anak-anak bermain di taman." },
      { word: "Memasak", meaning: "Cooking", example: "Cook dinner.", example_id: "Saya memasak makan malam untuk keluarga." },
      { word: "Berbelanja", meaning: "Shopping", example: "Go shopping at the market.", example_id: "Ibu pergi berbelanja di pasar." },
      { word: "Berjalan", meaning: "Walking", example: "Walk to school.", example_id: "Saya berjalan ke sekolah." },
      { word: "Menonton", meaning: "Watching", example: "Watch a movie at the cinema.", example_id: "Kami menonton film bersama." },
      { word: "Mendengar", meaning: "Listening", example: "Listen to your favorite music.", example_id: "Saya mendengarkan musik favorit saya." },
    ],
  },
];

// Quiz questions derived from vocabulary
export interface QuizQuestion {
  id: number;
  question: string;
  word: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

export function generateQuizQuestions(count: number = 10): QuizQuestion[] {
  const allWords: { word: VocabWord; category: string }[] = [];

  // Collect all words from all categories
  vocabularyData.forEach((category) => {
    category.words.forEach((word) => {
      allWords.push({ word, category: category.id });
    });
  });

  // Shuffle and pick random words
  const shuffled = allWords.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, allWords.length));

  // Generate questions
  return selected.map((item, index) => {
    // Get wrong answers from other words
    const wrongOptions = allWords
      .filter((w) => w.word.meaning !== item.word.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.word.meaning);

    // Create options array with correct answer and shuffle
    const options = [...wrongOptions, item.word.meaning].sort(
      () => Math.random() - 0.5
    );

    return {
      id: index + 1,
      question: `What does "${item.word.word}" mean in English?`,
      word: item.word.word,
      options,
      correctAnswer: item.word.meaning,
      category: item.category,
    };
  });
}

// Simple flashcard data for quick practice
export const flashcardData = [
  { word: "Rumah", meaning: "House" },
  { word: "Sekolah", meaning: "School" },
  { word: "Mobil", meaning: "Car" },
  { word: "Buku", meaning: "Book" },
  { word: "Air", meaning: "Water" },
];
