import { ActionFunctionArgs } from '@remix-run/node';
import { Link, redirect } from '@remix-run/react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';

import { prisma } from 'lib/prisma';
import { analyzeMood } from '~/utils/openai.server';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const date = formData.get('date') as string;
  const content = formData.get('content') as string;

  const mood = await analyzeMood(content);

  await prisma.diaryEntry.create({
    data: {
      date: new Date(date),
      content,
      mood,
    },
  });
  return redirect('/');
}

export default function DiaryNew() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-4'>New Diary Entry</h1>
      <Card className='max-w-3xl mx-auto border-2 border-gray-300 rounded-lg p-4'>
        <CardHeader>
          <CardTitle className='text-2xl'>Write New Diary</CardTitle>
        </CardHeader>
        <CardContent>
          <form method='post' className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='date'>Title</Label>
              <Input
                type='date'
                id='date'
                name='date'
                defaultValue={new Date().toISOString().split('T')[0]}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='content'>Content</Label>
              <Textarea
                id='content'
                name='content'
                rows={10}
                className='resize-none'
              />
            </div>
            <div className='flex justify-end'>
              <Link to='/'>
                <Button variant='outline'>Cancel</Button>
              </Link>
              <Button type='submit'>Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
