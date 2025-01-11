import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {

  const openai = new OpenAI();
  const { message } = await req.json();
  console.log(message)

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      messages: [
        {role: "developer", content: "You are a helpful assistant.Do not give answers in more than 3 lines."},
        {
          role:"user",
          content: `${message}`
        },
      ],
    });

    return NextResponse.json(completion.choices);
  } catch (error : unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}