import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { Form, Link, redirect, useLoaderData } from '@remix-run/react';
import { prisma } from 'lib/prisma';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { moodColors, MoodIcon } from '~/components/MoodIcon';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import type { DiaryEntry } from '~/types/types';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const entry = await prisma.diaryEntry.findUnique({
    where: { id: params.id },
  });

  if (!entry) {
    throw new Response('Not Found', { status: 404 });
  }

  const diaryEntry: DiaryEntry = {
    id: entry.id,
    title: entry.date.toLocaleDateString(),
    content: entry.content,
    date: entry.date.toISOString().split('T')[0],
    mood: (entry.mood as DiaryEntry['mood']) || 'normal',
  };

  return json({ diaryEntry });
};

export const action = async ({ params }: ActionFunctionArgs) => {
  await prisma.diaryEntry.delete({
    where: { id: params.id },
  });

  return redirect('/');
};

export default function DiaryDetail() {
  const { diaryEntry } = useLoaderData<typeof loader>();

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold'>Diary Detail</h1>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader
          className='flex flex-row justify-between items-center'
          style={{ backgroundColor: moodColors[diaryEntry.mood] }}
        >
          <CardTitle className='text-2xl'>{diaryEntry.title}</CardTitle>
          <MoodIcon mood={diaryEntry.mood} />
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground mb-4'>
            {diaryEntry.date}
          </p>
          <p className='whitespace-pre-wrap mb-8'>{diaryEntry.content}</p>
          <div className='flex gap-2 justify-end'>
            <Link to={`/diary/${diaryEntry.id}/edit`}>
              <Button variant='outline' className='flex gap-2'>
                <PencilIcon className='w-4 h-4' />
                Edit
              </Button>
            </Link>
            <Form method='post'>
              <Button
                type='submit'
                variant='destructive'
                className='flex gap-2'
                name='_action'
                value='delete'
              >
                <TrashIcon className='w-4 h-4' />
                Delete
              </Button>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
