export type WritingStyle = 'Storytelling' | 'Educational' | 'Motivational';
export type Language = 'English' | 'Hinglish';

export interface ScriptParams {
  topic: string;
  audience?: string;
  wordCount: number;
  style: WritingStyle;
  language: Language;
  referenceScript?: string;
}

export interface ImproveParams {
  roughDraft: string;
  referenceScript?: string;
}

export interface GeneratedScript {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}
