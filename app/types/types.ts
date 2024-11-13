export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'happy' | 'sad' | 'angry' | 'anxious' | 'normal' | 'excited';
};
