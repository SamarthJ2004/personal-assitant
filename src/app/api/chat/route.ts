import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type chatMessage = {role: "user"|"assistant"|"system"; content: string};
let chatHistory : chatMessage[] =[];

export async function POST(req: Request) {

  const openai = new OpenAI();
  const { message } = await req.json();
  console.log(message)

  chatHistory.push({ role: "user", content: message });
  if (chatHistory.length > 16) {
    chatHistory.shift();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      messages: [
        {role: "developer", content: "You are a helpful assistant.Do not give answers in more than 3 lines."},
        ...chatHistory
      ],
    });

    const botMessage = completion.choices[0].message.content || "Sorry, I couldn't generate a response";

    chatHistory.push({ role: "assistant", content: botMessage });
    if (chatHistory.length > 16) {
      chatHistory.shift();
    }

    return NextResponse.json(botMessage);
  } catch (error : unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}