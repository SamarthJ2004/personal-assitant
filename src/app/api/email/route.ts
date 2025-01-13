import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import nodemailer from "nodemailer";
import schedule from "node-schedule";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,  //this can your app password 
  },
});

const sendEmail = (to: string, subject: string, content: string) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to : to,
    subject: subject,
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const scheduleEmail = async (to: string, subject: string, content: string, sendTime: Date) => {
  console.log(`Scheduled email content: ${content}`);

  schedule.scheduleJob(sendTime, () => {
    sendEmail(to, subject, content);
  });
};

export async function POST(req: Request) {

  const openai = new OpenAI();
  const subject = await req.json();
  console.log("subject",subject);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
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

export async function PUT(req: Request) {
  const { recipientEmail, subject, sendTime, emailContent } = await req.json();
  console.log('emailContent', emailContent);
  console.log('recipientEmail', recipientEmail);
  console.log('subject', subject);
  console.log('sendTime', sendTime);

  try {
    const sendDate = new Date(sendTime);
    if (isNaN(sendDate.getTime())) {
      return NextResponse.json({ error: 'Invalid sendTime format' }, { status: 400 });
    }

    await scheduleEmail(recipientEmail, subject, emailContent, sendDate);

    return NextResponse.json({ message: 'Email scheduled successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}