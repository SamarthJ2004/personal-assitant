import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request){
  const openai = new OpenAI();
  const voiceMail= await req.json();

  console.log("Voice Mail: ",voiceMail);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      messages: [{role: "system", content: "Make the answer compact only "},{role:"user", content: voiceMail}],
    });
    
    const botMessage = response.choices[0].message.content || "Sorry, I couldn't generate the response";

    console.log(botMessage);
    return NextResponse.json(botMessage);
  } catch (error) {
    console.log("Error sending request to open ai: ", error);
  }
}