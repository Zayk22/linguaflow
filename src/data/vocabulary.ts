export interface VocabularyItem {
  id: string
  lang: "spanish" | "japanese" | "turkish"
  prompt: string
  answer: string
  hint?: string
  sourceLessonId: string
}

export const VOCABULARY_ITEMS: VocabularyItem[] = [
  // Spanish - Greetings (es-greet)
  { id: "es-greet-hello", lang: "spanish", prompt: 'How do you say "Hello" in Spanish?', answer: "Hola", hint: "Think warm greeting", sourceLessonId: "es-greet" },
  { id: "es-greet-good-morning", lang: "spanish", prompt: 'Translate: "Good morning"', answer: "Buenos días", hint: "Buen... días", sourceLessonId: "es-greet" },
  { id: "es-greet-good-night", lang: "spanish", prompt: 'What does "Buenos noches" mean?', answer: "Good night", hint: "Think evening", sourceLessonId: "es-greet" },
  { id: "es-greet-how-are-you", lang: "spanish", prompt: "¿Cómo estás?", answer: "How are you?", hint: "Common greeting question", sourceLessonId: "es-greet" },
  { id: "es-greet-see-you-later", lang: "spanish", prompt: 'Translate: "See you later"', answer: "Hasta luego", hint: "Hasta...", sourceLessonId: "es-greet" },

  // Japanese - Hiragana Vowels (jp-vowels)
  { id: "jp-vowels-a", lang: "japanese", prompt: "What is the hiragana for 'a'?", answer: "あ", hint: "First vowel", sourceLessonId: "jp-vowels" },
  { id: "jp-vowels-ka", lang: "japanese", prompt: "Type the hiragana for 'ka'", answer: "か", hint: "か", sourceLessonId: "jp-vowels" },
  { id: "jp-vowels-u", lang: "japanese", prompt: "What sound does 'う' make?", answer: "u", hint: "Third vowel", sourceLessonId: "jp-vowels" },
  { id: "jp-vowels-o", lang: "japanese", prompt: "お", answer: "o (as in 'o'clock)", hint: "Fifth vowel", sourceLessonId: "jp-vowels" },
  { id: "jp-vowels-e", lang: "japanese", prompt: "Which is 'e' in hiragana?", answer: "え", hint: "Fourth vowel", sourceLessonId: "jp-vowels" },

  // Turkish - Greetings (tr-greet)
  { id: "tr-greet-hello", lang: "turkish", prompt: 'How do you say "Hello" in Turkish?', answer: "Merhaba", hint: "Common greeting", sourceLessonId: "tr-greet" },
  { id: "tr-greet-good-morning", lang: "turkish", prompt: 'Translate: "Good morning"', answer: "Günaydın", hint: "Gün = day", sourceLessonId: "tr-greet" },
  { id: "tr-greet-thank-you", lang: "turkish", prompt: "Teşekkür ederim", answer: "Thank you", hint: "Formal thanks", sourceLessonId: "tr-greet" },
  { id: "tr-greet-good-night", lang: "turkish", prompt: 'What does "İyi geceler" mean?', answer: "Good night", hint: "İyi = good, gece = night", sourceLessonId: "tr-greet" },
  { id: "tr-greet-goodbye", lang: "turkish", prompt: 'Translate: "Goodbye"', answer: "Hoşça kal", hint: "Hoş...", sourceLessonId: "tr-greet" },
]