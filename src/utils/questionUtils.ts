import { LanguageCode, loadLanguagePreference } from './i18n';

export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: string; // For multi/sort, this is comma-separated values
  type: 'text' | 'choice' | 'image' | 'boolean' | 'multi' | 'sort' | 'short_answer';
  category: string;
  imageDesc?: string;
  image?: string;
  timed?: boolean;
  timeLimit?: number;
}

// Default fallback questions in case fetch fails
const DEFAULT_QUESTIONS: Question[] = [
  { id: 'm1', text: '5th Prime?', options: ['7', '11'], answer: '11', type: 'choice', category: 'Math' },
  { id: 's1', text: 'Water Freeze (C)?', options: ['0°C', '32°C'], answer: '0°C', type: 'choice', category: 'Science' },
];

class QuestionRegistry {
  private questions: Question[] = [...DEFAULT_QUESTIONS];
  private regionalQuestions: Question[] = [];
  private isLoaded: boolean = false;
  private currentLanguage: LanguageCode = 'en';

  async load(language?: LanguageCode) {
    const lang = language || loadLanguagePreference();
    this.currentLanguage = lang;

    try {
      // Load main questions
      const res = await fetch('/questions.json');
      if (res.ok) {
        const data = await res.json();
        this.questions = data;
        console.log('Main questions loaded:', this.questions.length);
      }

      // Load regional questions for the language (if not English)
      if (lang !== 'en') {
        await this.loadRegionalQuestions(lang);
      }

      this.isLoaded = true;
    } catch (e) {
      console.error('Failed to load questions:', e);
    }
  }

  async loadRegionalQuestions(lang: LanguageCode) {
    try {
      // Dynamic import of regional questions
      const langMap: Record<LanguageCode, () => Promise<any>> = {
        en: async () => ({ default: [] }),
        es: () => import('../data/questions_es.json'),
        fr: () => import('../data/questions_fr.json'),
        de: () => import('../data/questions_de.json'),
        nl: () => import('../data/questions_nl.json'),
        zh: () => import('../data/questions_zh.json'),
        ja: () => import('../data/questions_ja.json'),
        ru: () => import('../data/questions_ru.json'),
        pt: () => import('../data/questions_pt.json'),
        ar: () => import('../data/questions_ar.json'),
      };

      const module = await langMap[lang]();
      this.regionalQuestions = module.default || [];
      console.log(`Regional questions loaded for ${lang}:`, this.regionalQuestions.length);
    } catch (e) {
      console.error(`Failed to load regional questions for ${lang}:`, e);
      this.regionalQuestions = [];
    }
  }

  setLanguage(lang: LanguageCode) {
    if (lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      this.loadRegionalQuestions(lang);
    }
  }

  getAll(): Question[] {
    return this.questions;
  }

  getRegional(): Question[] {
    return this.regionalQuestions;
  }

  getAllWithRegional(): Question[] {
    return [...this.questions, ...this.regionalQuestions];
  }

  add(q: Question) {
    this.questions.push(q);
  }

  update(id: string, updates: Partial<Question>) {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.questions[idx] = { ...this.questions[idx], ...updates };
    }
  }

  setAll(questions: Question[]) {
    this.questions = questions;
  }

  delete(id: string) {
    this.questions = this.questions.filter(q => q.id !== id);
  }

  getRandom(): Question {
    // Combine main questions with regional questions
    const allQuestions = this.getAllWithRegional();
    if (allQuestions.length === 0) return DEFAULT_QUESTIONS[0];

    // 30% chance to get a regional question if available
    const useRegional = this.regionalQuestions.length > 0 && Math.random() < 0.3;
    const pool = useRegional ? this.regionalQuestions : this.questions;
    const q = pool[Math.floor(Math.random() * pool.length)] || DEFAULT_QUESTIONS[0];

    // 10% chance to be timed
    if (Math.random() < 0.1) {
      return { ...q, timed: true, timeLimit: 10 }; // 10 seconds default
    }
    return q;
  }
}

export const registry = new QuestionRegistry();

export const getRandomQuestion = (): Question => {
  return registry.getRandom();
};

export const checkAnswer = (question: Question, input: string): boolean => {
  if (question.type === 'text' || question.type === 'short_answer') {
    return input.trim().toLowerCase() === question.answer.toLowerCase();
  }
  if (question.type === 'multi') {
    // Sort both input and answer to ensure order doesn't matter for multi-select
    const inputParts = input.split(',').map(s => s.trim()).sort();
    const answerParts = question.answer.split(',').map(s => s.trim()).sort();
    return JSON.stringify(inputParts) === JSON.stringify(answerParts);
  }
  // For sort, order matters, so direct string comparison is fine if input is constructed correctly
  return input === question.answer;
};
