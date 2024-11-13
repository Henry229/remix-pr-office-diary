import { Angry, Annoyed, Frown, Meh, Smile } from 'lucide-react';
import { DiaryEntry } from '~/types/types';

export const moodColors = {
  happy: '#FFD700',
  sad: '#505050',
  angry: '#FFA500',
  anxious: '#FF0000',
  normal: '#008080',
  excited: '#800080',
} as const;

export const MoodIcon = ({ mood }: { mood: DiaryEntry['mood'] }) => {
  const iconProps = { size: 24, className: 'ml-2' };
  switch (mood) {
    case 'happy':
      return <Smile {...iconProps} />;
    case 'sad':
      return <Frown {...iconProps} />;
    case 'angry':
      return <Angry {...iconProps} />;
    case 'anxious':
      return <Annoyed {...iconProps} />;
    case 'normal':
      return <Meh {...iconProps} />;
  }
};
