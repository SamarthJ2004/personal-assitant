import { NextResponse } from 'next/server';
import schedule from 'node-schedule';
import OpenAI from 'openai';
import twilio from 'twilio';

const client = new twilio.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function fetchCryptoPrices() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
  const data = await response.json();
  return data;
}

async function sendSMS(number: string, crypto: string, cryptoPrice: number, threshold: number) {
  const prompt = `The current price of ${crypto} is $${cryptoPrice}, which has crossed the threshold of $${threshold}. Provide a very brief analysis or suggestion for the user.`;

  const openai = new OpenAI();

  try {
    const stockMessage = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 50,
      messages: [
        {role: "developer", content: prompt},
      ]
    });

    const botMessage = stockMessage.choices[0].message.content || `The price of ${crypto} has crossed the threshold.`;
    console.log( " Stock message: ", botMessage);

    client.messages.create({
      body: botMessage,
      to: 'whatsapp:+91'+number,
      from: process.env.TWILIO_PHONE
    })
    .then((message) => console.log('Message sent:', message.sid))
    .catch((error) => console.error('Error sending SMS:', error));

  } catch (error) {
    console.log("Error generation stock message: ", error);
  }
}

function schedulePriceCheck(currency: string, threshold: number, phoneNumber: string) {
  schedule.scheduleJob('*/5 * * * *', async () => {
    console.log("Scheduling job");
    try {
      const prices = await fetchCryptoPrices();
      console.log("Fetched Prices: " ,prices);
      const cryptoPrice = prices[currency].usd;

      if (cryptoPrice > threshold) {
        await sendSMS(phoneNumber, currency, cryptoPrice, threshold);
      }
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    }
  });
}

export async function POST(req: Request) {
  try {
    const { currency, threshold, phoneNumber } = await req.json();
    console.log("Received data:", currency, threshold, phoneNumber);

    schedulePriceCheck(currency.toLowerCase(), parseFloat(threshold), phoneNumber);

    return NextResponse.json({ message: 'Price check scheduled successfully.' });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.error();
  }
}