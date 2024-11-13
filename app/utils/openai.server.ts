import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Mood = 'happy' | 'sad' | 'angry' | 'anxious' | 'normal' | 'excited';

export async function analyzeMood(content: string): Promise<Mood> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in analyzing emotions from text. Please analyze the given text and return only one of the following emotions: happy, sad, angry, anxious, normal, excited',
        },
        {
          role: 'user',
          content: `Please analyze the emotion in the following text: "${content}"`,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      max_tokens: 10,
    });

    const mood = completion.choices[0].message.content?.trim() as Mood;
    return mood || 'normal';
  } catch (error) {
    console.error('Error occurred during emotion analysis:', error);
    return 'normal';
  }
}
