import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import type { DiaryEntry } from '~/types/types';
import {
  Angry,
  Annoyed,
  Frown,
  Meh,
  PlusCircleIcon,
  Smile,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { prisma } from 'lib/prisma';
import type { DiaryEntry as DbDiaryEntry } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const moodColors = {
  happy: '#FFD700',
  sad: '#505050',
  angry: '#FFA500',
  anxious: '#FF0000',
  normal: '#008080',
  excited: '#800080',
} as const;

const MoodIcon = ({ mood }: { mood: DiaryEntry['mood'] }) => {
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

export const meta: MetaFunction = () => {
  return [
    { title: 'Mood-Diary Practice' },
    {
      name: 'mood-diary',
      content: 'Try to write your mood diary everyday',
    },
  ];
};

export async function loader() {
  const entries = await prisma.diaryEntry.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  const diaryEntries: DiaryEntry[] = entries.map((entry: DbDiaryEntry) => ({
    id: entry.id,
    title: entry.date.toLocaleDateString(),
    content: entry.content,
    date: entry.date.toISOString().split('T')[0],
    mood: (entry.mood as DiaryEntry['mood']) || 'normal',
    moodColor: entry.moodColor,
  }));
  return json({ diaryEntries });
}

export default function Index() {
  const { diaryEntries } = useLoaderData<typeof loader>();
  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <Link to='/'>
          <h1 className='text-4xl font-bold'>My diary</h1>
        </Link>
        <Link to='/diary/new'>
          <Button>
            <PlusCircleIcon className='w-6 h-6' />
            Add New Diary
          </Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {diaryEntries.map((entry) => (
          <Link to={`/diary/${entry.id}/detail`} key={entry.id}>
            <Card
              className='transform transition-all hover:scale-105'
              style={{ backgroundColor: moodColors[entry.mood] }}
            >
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-xl'>{entry.title}</CardTitle>
                <MoodIcon mood={entry.mood} />
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{entry.date}</p>
                <p className='line-clamp-3'>{entry.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
