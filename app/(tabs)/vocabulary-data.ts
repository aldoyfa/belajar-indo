/**
 * Complete Vocabulary Data - 45 Words (from Web Version)
 * Categories: Food & Drinks, Family, Daily Activities
 */

export interface VocabItem {
  word: string;
  meaning: string;
  example: string;
  category: string;
}

export const VOCAB_CATEGORIES = {
  makanan: {
    title: '🍽️ Food & Drinks',
    color: ['#667eea', '#764ba2'],
    items: [
      { word: 'Nasi', meaning: 'Rice', example: 'I eat rice every day.', category: 'Food' },
      { word: 'Air', meaning: 'Water', example: 'Drinking water is healthy.', category: 'Drinks' },
      { word: 'Makan', meaning: 'Eat', example: 'We eat together.', category: 'Food' },
      { word: 'Minum', meaning: 'Drink', example: 'I drink hot tea.', category: 'Drinks' },
      { word: 'Roti', meaning: 'Bread', example: 'I have bread for breakfast.', category: 'Food' },
      { word: 'Buah', meaning: 'Fruit', example: 'Eating fruit is good for health.', category: 'Food' },
      { word: 'Sayur', meaning: 'Vegetable', example: 'Vegetables contain vitamins.', category: 'Food' },
      { word: 'Daging', meaning: 'Meat', example: 'This meat is delicious.', category: 'Food' },
      { word: 'Ikan', meaning: 'Fish', example: 'Fish is a source of protein.', category: 'Food' },
      { word: 'Telur', meaning: 'Egg', example: 'I cook eggs every morning.', category: 'Food' },
      { word: 'Susu', meaning: 'Milk', example: 'Milk is good for bones.', category: 'Drinks' },
      { word: 'Keju', meaning: 'Cheese', example: 'I like cheese on pizza.', category: 'Food' },
      { word: 'Gula', meaning: 'Sugar', example: 'Too much sugar is unhealthy.', category: 'Food' },
      { word: 'Garam', meaning: 'Salt', example: 'Add salt to the soup.', category: 'Food' },
      { word: 'Kopi', meaning: 'Coffee', example: 'I drink coffee in the morning.', category: 'Drinks' },
    ]
  },
  keluarga: {
    title: '👨‍👩‍👧 Family',
    color: ['#f093fb', '#f5576c'],
    items: [
      { word: 'Ayah', meaning: 'Father', example: 'Father goes to work.', category: 'Family' },
      { word: 'Ibu', meaning: 'Mother', example: 'Mother cooks in the kitchen.', category: 'Family' },
      { word: 'Kakak', meaning: 'Older Sibling', example: 'My older brother is tall.', category: 'Family' },
      { word: 'Adik', meaning: 'Younger Sibling', example: 'My younger sister is cute.', category: 'Family' },
      { word: 'Nenek', meaning: 'Grandmother', example: 'Grandmother tells stories.', category: 'Family' },
      { word: 'Kakek', meaning: 'Grandfather', example: 'Grandfather likes gardening.', category: 'Family' },
      { word: 'Paman', meaning: 'Uncle', example: 'Uncle visits every weekend.', category: 'Family' },
      { word: 'Bibi', meaning: 'Aunt', example: 'Aunt bakes delicious cakes.', category: 'Family' },
      { word: 'Sepupu', meaning: 'Cousin', example: 'My cousin lives in Jakarta.', category: 'Family' },
      { word: 'Keponakan', meaning: 'Nephew/Niece', example: 'My nephew is very smart.', category: 'Family' },
      { word: 'Suami', meaning: 'Husband', example: 'Her husband works in a bank.', category: 'Family' },
      { word: 'Istri', meaning: 'Wife', example: 'His wife is a teacher.', category: 'Family' },
      { word: 'Anak', meaning: 'Child', example: 'They have three children.', category: 'Family' },
      { word: 'Cucu', meaning: 'Grandchild', example: 'Grandmother loves her grandchildren.', category: 'Family' },
      { word: 'Keluarga', meaning: 'Family', example: 'Family is very important.', category: 'Family' },
    ]
  },
  sehari: {
    title: '🏠 Daily Activities',
    color: ['#4facfe', '#00f2fe'],
    items: [
      { word: 'Belajar', meaning: 'Study', example: 'I study Indonesian every day.', category: 'Activity' },
      { word: 'Tidur', meaning: 'Sleep', example: 'Getting enough sleep is important.', category: 'Activity' },
      { word: 'Bangun', meaning: 'Wake up', example: 'I wake up at 6 AM.', category: 'Activity' },
      { word: 'Mandi', meaning: 'Bathe', example: 'I take a shower every morning.', category: 'Activity' },
      { word: 'Kerja', meaning: 'Work', example: 'He works in an office.', category: 'Activity' },
      { word: 'Sarapan', meaning: 'Breakfast', example: 'Breakfast is the most important meal.', category: 'Activity' },
      { word: 'Olahraga', meaning: 'Exercise', example: 'I exercise three times a week.', category: 'Activity' },
      { word: 'Membaca', meaning: 'Read', example: 'Reading improves knowledge.', category: 'Activity' },
      { word: 'Menulis', meaning: 'Write', example: 'She writes in her diary.', category: 'Activity' },
      { word: 'Bermain', meaning: 'Play', example: 'Children play in the park.', category: 'Activity' },
      { word: 'Memasak', meaning: 'Cook', example: 'Cooking is my hobby.', category: 'Activity' },
      { word: 'Berbelanja', meaning: 'Shop', example: 'We shop at the market.', category: 'Activity' },
      { word: 'Berjalan', meaning: 'Walk', example: 'Walking is good for health.', category: 'Activity' },
      { word: 'Menonton', meaning: 'Watch', example: 'I watch movies on weekends.', category: 'Activity' },
      { word: 'Mendengar', meaning: 'Listen', example: 'Listen to music to relax.', category: 'Activity' },
    ]
  }
};

// Flatten all vocab items for search/filter
export const getAllVocabItems = (): VocabItem[] => {
  const allItems: VocabItem[] = [];
  Object.values(VOCAB_CATEGORIES).forEach(category => {
    allItems.push(...category.items);
  });
  return allItems;
};

// Get vocab by category
export const getVocabByCategory = (categoryKey: keyof typeof VOCAB_CATEGORIES) => {
  return VOCAB_CATEGORIES[categoryKey];
};

// Search vocab items
export const searchVocab = (query: string): VocabItem[] => {
  const allItems = getAllVocabItems();
  const lowerQuery = query.toLowerCase();
  
  return allItems.filter(item =>
    item.word.toLowerCase().includes(lowerQuery) ||
    item.meaning.toLowerCase().includes(lowerQuery) ||
    item.example.toLowerCase().includes(lowerQuery)
  );
};
