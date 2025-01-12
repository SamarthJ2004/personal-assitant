import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {

  const openai = new OpenAI();
  const subject = await req.json();
  console.log("subject",subject);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      messages: [
        { role:"developer", content:"You write formal emails in not more than 50 words. Start with a proper salutation. Don't include any other information other than the email just return the body.For the recipient name put Sir/Maam and don't include any ending regards."},
        { role:"user", content:`Write an email about ${subject}`}
      ]
    });

    console.log("completion: ", completion.choices[0].message.content);

    const botMessage = completion.choices[0].message.content || "Sorry, I couldn't generate the email";

    return NextResponse.json(botMessage);
  } catch (error : unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}