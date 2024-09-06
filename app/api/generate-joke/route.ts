import OpenAI from "openai";
import { NextResponse } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { tone } = await req.json();
  console.log('messages = ', tone);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: 'assistant',
        content: 'Make a joke with the tone of ' + tone,
      },
    ],
  });

  return NextResponse.json({joke: response.choices[0].message.content});
}