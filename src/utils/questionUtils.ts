export interface Question {
  id: string;
  text: string;
  options: string[]; 
  answer: string; // For multi/sort, this is comma-separated values
  type: 'text' | 'choice' | 'image' | 'boolean' | 'multi' | 'sort' | 'short_answer';
  category: 'Math' | 'Science' | 'Geography' | 'General' | 'Social';
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
  private isLoaded: boolean = false;

  async load() {
    if (this.isLoaded) return;
    try {
      const res = await fetch('/questions.json');
      if (res.ok) {
        const data = await res.json();
        this.questions = data;
        this.isLoaded = true;
        console.log('Questions loaded:', this.questions.length);
      }
    } catch (e) {
      console.error('Failed to load questions:', e);
    }
  }

  getAll(): Question[] {
    return this.questions;
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
    if (this.questions.length === 0) return DEFAULT_QUESTIONS[0];
    
    const q = this.questions[Math.floor(Math.random() * this.questions.length)];

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
