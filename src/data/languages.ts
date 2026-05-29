export interface LanguageConfig {
  id: string
  name: string
  nativeName: string
  flag: string
  tagline: string
  gradient: string
  bgGradient: string
  accentColor: string
  glowColor: string
  symbol: string
  symbolMeaning: string
  themeClass: string
}

export interface Lesson {
  id: string
  title: string
  subtitle: string
  type: "vocabulary" | "grammar" | "conversation" | "listening" | "pronunciation"
  xp: number
  duration: number
  locked: boolean
  icon: string
}

export interface LessonUnit {
  id: string
  title: string
  description: string
  color: string
  lessons: Lesson[]
}

export interface LearningPath {
  beginner: LessonUnit[]
  intermediate: LessonUnit[]
  advanced: LessonUnit[]
}

export const LANGUAGES: LanguageConfig[] = [
  {
    id: "spanish",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    tagline: "The world's second most spoken language",
    gradient: "from-orange-600 via-red-500 to-amber-500",
    bgGradient: "from-orange-950/40 via-red-950/20 to-background",
    accentColor: "oklch(0.65 0.22 38)",
    glowColor: "oklch(0.65 0.22 38 / 40%)",
    symbol: "¡Hola!",
    symbolMeaning: "Hello!",
    themeClass: "lang-spanish",
  },
  {
    id: "japanese",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    tagline: "Master the language of anime, manga & culture",
    gradient: "from-rose-600 via-red-500 to-rose-400",
    bgGradient: "from-rose-950/40 via-red-950/20 to-background",
    accentColor: "oklch(0.62 0.24 10)",
    glowColor: "oklch(0.62 0.24 10 / 40%)",
    symbol: "こんにちは",
    symbolMeaning: "Konnichiwa",
    themeClass: "lang-japanese",
  },
  {
    id: "turkish",
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    tagline: "Gateway between Europe and Asia",
    gradient: "from-amber-600 via-orange-500 to-red-500",
    bgGradient: "from-amber-950/40 via-orange-950/20 to-background",
    accentColor: "oklch(0.60 0.18 50)",
    glowColor: "oklch(0.60 0.18 50 / 40%)",
    symbol: "Merhaba",
    symbolMeaning: "Hello",
    themeClass: "lang-turkish",
  },
]

export const LEARNING_PATHS: Record<string, LearningPath> = {
  spanish: {
    beginner: [
      {
        id: "es-basics",
        title: "Basics",
        description: "Core vocabulary and pronunciation",
        color: "from-orange-500 to-red-500",
        lessons: [
          { id: "es-greet", title: "Greetings", subtitle: "Hola, Buenos días...", type: "vocabulary", xp: 15, duration: 5, locked: false, icon: "👋" },
          { id: "es-intro", title: "Introductions", subtitle: "Me llamo, Soy de...", type: "conversation", xp: 20, duration: 7, locked: false, icon: "🤝" },
          { id: "es-numbers", title: "Numbers 1-20", subtitle: "Uno, dos, tres...", type: "vocabulary", xp: 15, duration: 5, locked: false, icon: "🔢" },
          { id: "es-colors", title: "Colors", subtitle: "Rojo, azul, verde...", type: "vocabulary", xp: 15, duration: 5, locked: true, icon: "🎨" },
          { id: "es-phonics", title: "Pronunciation", subtitle: "Spanish sounds", type: "pronunciation", xp: 25, duration: 8, locked: true, icon: "🎤" },
        ],
      },
      {
        id: "es-daily",
        title: "Daily Life",
        description: "Essential everyday phrases",
        color: "from-amber-500 to-orange-500",
        lessons: [
          { id: "es-food", title: "Food & Drinks", subtitle: "Comida y bebidas", type: "vocabulary", xp: 20, duration: 6, locked: true, icon: "🍽️" },
          { id: "es-family", title: "Family", subtitle: "Familia y relaciones", type: "vocabulary", xp: 20, duration: 6, locked: true, icon: "👨‍👩‍👧" },
          { id: "es-time", title: "Time & Days", subtitle: "Días de la semana", type: "vocabulary", xp: 20, duration: 6, locked: true, icon: "⏰" },
        ],
      },
    ],
    intermediate: [
      {
        id: "es-conv",
        title: "Conversation",
        description: "Real-world dialogue skills",
        color: "from-red-500 to-pink-500",
        lessons: [
          { id: "es-travel", title: "Travel Phrases", subtitle: "At the airport, hotel", type: "conversation", xp: 30, duration: 10, locked: false, icon: "✈️" },
          { id: "es-shopping", title: "Shopping", subtitle: "¿Cuánto cuesta?", type: "conversation", xp: 30, duration: 10, locked: false, icon: "🛍️" },
          { id: "es-directions", title: "Directions", subtitle: "A la derecha, izquierda", type: "conversation", xp: 30, duration: 10, locked: true, icon: "🗺️" },
        ],
      },
      {
        id: "es-grammar",
        title: "Grammar",
        description: "Verb conjugations and tenses",
        color: "from-orange-500 to-yellow-500",
        lessons: [
          { id: "es-present", title: "Present Tense", subtitle: "Regular -ar, -er, -ir verbs", type: "grammar", xp: 35, duration: 12, locked: true, icon: "📝" },
          { id: "es-past", title: "Past Tense", subtitle: "Pretérito perfecto", type: "grammar", xp: 35, duration: 12, locked: true, icon: "📖" },
        ],
      },
    ],
    advanced: [
      {
        id: "es-native",
        title: "Native Expressions",
        description: "Idioms and colloquialisms",
        color: "from-red-600 to-rose-600",
        lessons: [
          { id: "es-idioms", title: "Spanish Idioms", subtitle: "Native expressions", type: "conversation", xp: 50, duration: 15, locked: false, icon: "💬" },
          { id: "es-media", title: "Media Analysis", subtitle: "Movies, music, news", type: "listening", xp: 50, duration: 15, locked: true, icon: "🎬" },
          { id: "es-business", title: "Business Spanish", subtitle: "Professional communication", type: "conversation", xp: 60, duration: 18, locked: true, icon: "💼" },
        ],
      },
    ],
  },
  japanese: {
    beginner: [
      {
        id: "jp-hiragana",
        title: "Hiragana",
        description: "Master the first Japanese script",
        color: "from-pink-500 to-rose-500",
        lessons: [
          { id: "jp-vowels", title: "Vowels あいうえお", subtitle: "a, i, u, e, o", type: "pronunciation", xp: 20, duration: 7, locked: false, icon: "🔤" },
          { id: "jp-ka-row", title: "Ka Row かきくけこ", subtitle: "ka, ki, ku, ke, ko", type: "vocabulary", xp: 20, duration: 7, locked: false, icon: "✍️" },
          { id: "jp-greet", title: "Greetings", subtitle: "こんにちは, おはよう", type: "conversation", xp: 15, duration: 5, locked: false, icon: "🙏" },
          { id: "jp-numbers", title: "Numbers", subtitle: "一二三四五", type: "vocabulary", xp: 15, duration: 5, locked: true, icon: "🔢" },
        ],
      },
      {
        id: "jp-katakana",
        title: "Katakana",
        description: "Foreign words and loanwords",
        color: "from-fuchsia-500 to-purple-500",
        lessons: [
          { id: "jp-kata-basics", title: "Katakana Basics", subtitle: "アイウエオ", type: "vocabulary", xp: 20, duration: 7, locked: true, icon: "📝" },
          { id: "jp-loanwords", title: "Loanwords", subtitle: "アニメ, コーヒー", type: "vocabulary", xp: 20, duration: 7, locked: true, icon: "🌍" },
        ],
      },
    ],
    intermediate: [
      {
        id: "jp-kanji",
        title: "Kanji Foundations",
        description: "Essential Chinese characters",
        color: "from-rose-500 to-pink-600",
        lessons: [
          { id: "jp-kanji-basic", title: "Basic Kanji", subtitle: "人口火水", type: "vocabulary", xp: 35, duration: 12, locked: false, icon: "漢" },
          { id: "jp-kanji-nature", title: "Nature Kanji", subtitle: "山川海空", type: "vocabulary", xp: 35, duration: 12, locked: false, icon: "🌸" },
          { id: "jp-keigo", title: "Polite Speech", subtitle: "Keigo basics", type: "conversation", xp: 40, duration: 14, locked: true, icon: "🎌" },
        ],
      },
      {
        id: "jp-anime",
        title: "Anime & Media",
        description: "Popular expressions from culture",
        color: "from-purple-500 to-fuchsia-500",
        lessons: [
          { id: "jp-anime-phrases", title: "Anime Phrases", subtitle: "よし！すごい！", type: "conversation", xp: 30, duration: 10, locked: true, icon: "🎌" },
          { id: "jp-slang", title: "Modern Slang", subtitle: "やばい, めっちゃ", type: "conversation", xp: 30, duration: 10, locked: true, icon: "✨" },
        ],
      },
    ],
    advanced: [
      {
        id: "jp-advanced",
        title: "Advanced Japanese",
        description: "Native-level comprehension",
        color: "from-pink-600 to-rose-700",
        lessons: [
          { id: "jp-jlpt2", title: "JLPT N2 Prep", subtitle: "Advanced grammar", type: "grammar", xp: 60, duration: 20, locked: false, icon: "📚" },
          { id: "jp-business", title: "Business Japanese", subtitle: "Formal correspondence", type: "conversation", xp: 60, duration: 20, locked: true, icon: "💼" },
        ],
      },
    ],
  },
  turkish: {
    beginner: [
      {
        id: "tr-basics",
        title: "Temel Türkçe",
        description: "Turkish fundamentals",
        color: "from-amber-500 to-orange-500",
        lessons: [
          { id: "tr-greet", title: "Greetings", subtitle: "Merhaba, Günaydın", type: "conversation", xp: 15, duration: 5, locked: false, icon: "👋" },
          { id: "tr-alphabet", title: "Turkish Alphabet", subtitle: "Special characters: ç, ş, ğ", type: "pronunciation", xp: 20, duration: 7, locked: false, icon: "🔤" },
          { id: "tr-numbers", title: "Numbers", subtitle: "Bir, iki, üç...", type: "vocabulary", xp: 15, duration: 5, locked: false, icon: "🔢" },
          { id: "tr-colors", title: "Colors", subtitle: "Kırmızı, mavi, yeşil", type: "vocabulary", xp: 15, duration: 5, locked: true, icon: "🎨" },
        ],
      },
      {
        id: "tr-daily",
        title: "Günlük Hayat",
        description: "Everyday Turkish phrases",
        color: "from-orange-500 to-red-500",
        lessons: [
          { id: "tr-food", title: "Food & Cuisine", subtitle: "Turkish cuisine vocab", type: "vocabulary", xp: 20, duration: 6, locked: true, icon: "🍽️" },
          { id: "tr-bazaar", title: "At the Bazaar", subtitle: "Shopping in Turkey", type: "conversation", xp: 20, duration: 6, locked: true, icon: "🏪" },
        ],
      },
    ],
    intermediate: [
      {
        id: "tr-grammar",
        title: "Grammar Structures",
        description: "Agglutinative language patterns",
        color: "from-red-500 to-amber-500",
        lessons: [
          { id: "tr-suffixes", title: "Suffix System", subtitle: "Turkish case endings", type: "grammar", xp: 35, duration: 12, locked: false, icon: "📝" },
          { id: "tr-tenses", title: "Verb Tenses", subtitle: "Past, present, future", type: "grammar", xp: 35, duration: 12, locked: false, icon: "⏱️" },
          { id: "tr-culture", title: "Turkish Culture", subtitle: "Customs and traditions", type: "conversation", xp: 30, duration: 10, locked: true, icon: "🕌" },
        ],
      },
    ],
    advanced: [
      {
        id: "tr-advanced",
        title: "Advanced Turkish",
        description: "Fluency and expression",
        color: "from-amber-600 to-orange-700",
        lessons: [
          { id: "tr-idioms", title: "Turkish Idioms", subtitle: "Native expressions", type: "conversation", xp: 50, duration: 15, locked: false, icon: "💬" },
          { id: "tr-media", title: "Turkish Media", subtitle: "TV series, music", type: "listening", xp: 50, duration: 15, locked: true, icon: "📺" },
          { id: "tr-business", title: "Business Turkish", subtitle: "Professional language", type: "conversation", xp: 60, duration: 18, locked: true, icon: "💼" },
        ],
      },
    ],
  },
}

export function getLanguageConfig(id: string): LanguageConfig | undefined {
  return LANGUAGES.find((l) => l.id === id)
}

export function getLearningPath(langId: string, level: string): LessonUnit[] {
  const path = LEARNING_PATHS[langId]
  if (!path) return []
  return path[level as keyof LearningPath] ?? []
}
