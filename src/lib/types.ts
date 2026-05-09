export interface BaziInput {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;     // YYYY-MM-DD
  birthTime: string;     // HH:MM
  isLunar: boolean;      // 是否农历
}

export interface ReadingRecord {
  id: string;
  type: 'bazi';
  baziInput: BaziInput;
  analysis: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
