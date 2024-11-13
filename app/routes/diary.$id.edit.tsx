import { DiaryEntry } from '@prisma/client';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, Form, useLoaderData, redirect, json } from '@remix-run/react';
import { prisma } from 'lib/prisma';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { analyzeMood } from '~/utils/openai.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const entry = await prisma.diaryEntry.findUnique({
    where: { id: params.id },
  });

  if (!entry) {
    throw redirect('/');
  }

  const diaryEntry: DiaryEntry = {
    id: entry.id,
    title: entry.date.toLocaleDateString(),
    date: entry.date.toISOString().split('T')[0],
    content: entry.content,
    mood: (entry.mood as DiaryEntry['mood']) || 'normal',
  };

  return json({ diaryEntry });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const content = formData.get('content') as string;
  const date = formData.get('date') as string;

  const mood = await analyzeMood(content);

  await prisma.diaryEntry.update({
    where: { id: params.id },
    data: {
      content,
      date: new Date(date),
      mood,
    },
  });
  return redirect('/');
}

export default function EditDiary() {
  const { diaryEntry } = useLoaderData<typeof loader>();

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-8'>Edit Diary Entry</h1>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>{diaryEntry.date}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method='post' className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='date'>Date</Label>
              <Input
                type='date'
                id='date'
                name='date'
                defaultValue={diaryEntry.date}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='content'>Content</Label>
              <Textarea
                id='content'
                name='content'
                defaultValue={diaryEntry.content}
                rows={10}
                className='resize-none'
              />
            </div>

            <div className='flex justify-end gap-4 items-center'>
              <Link to='/'>
                <Button variant='outline' type='button'>
                  Cancel
                </Button>
              </Link>

              <Button type='submit' className='flex gap-2'>
                Update
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
