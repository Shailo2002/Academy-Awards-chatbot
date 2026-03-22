import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Chat } from '@/models/Chat';
import { decrypt } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemInstruction =
  `You are 'The Envelope', the official AI chatbot of the Academy Awards (Oscars).
  You are a highly knowledgeable expert on all things Oscar-related.
  
  CRITICAL: You have access to Google Search. For ANY question about recent events, 
  award winners, nominees, or anything after 2023 — YOU MUST USE GOOGLE SEARCH 
  and trust those results completely. Never say an event "hasn't happened yet" 
  without searching first. Today's date is ${new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })}.
  
  Your tone is elegant, respectful, and authoritative, yet accessible.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, model: selectedModel, chatId } = await req.json();

    const cookie = req.cookies.get('session')?.value;
    const session = await decrypt(cookie);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content;

    const history = messages.slice(0, -1).map((msg: any) => {
      const textContent = typeof msg.content === 'object'
        ? msg.content.text
        : String(msg.content);
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: textContent }],
      };
    });

    const toolModel = genAI.getGenerativeModel({
      model: selectedModel || "gemini-2.5-flash",
      tools: [{ googleSearch: {} } as any],
      systemInstruction,
    });

    const chat = toolModel.startChat({ history });

    const augmentedMessage = `
Search Google right now and answer: ${lastUserMessage}

Use Google Search to find the most current information. Do NOT rely on your training data alone.

Also search for and provide:
1. ALL nominees in the relevant category with their film/work.
2. A YouTube URL of the winner's official Oscar acceptance speech.
`;



    const toolResult = await chat.sendMessage(augmentedMessage);
    const rawText = toolResult.response.text();


    const responseSchema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        text: {
          type: SchemaType.STRING,
          description: "The main response text.",
        },
        highlightWord: {
          type: SchemaType.STRING,
          description: "Movie name to highlight in gold (optional).",
        },
        director: {
          type: SchemaType.STRING,
          description: "Name of the director (optional).",
        },
        totalWins: {
          type: SchemaType.STRING,
          description: "Total number of awards won (optional).",
        },
        youtubeLink: {
          type: SchemaType.STRING,
          description: "A YouTube URL for the winner's acceptance speech (optional).",
        },
        nominees: {
          type: SchemaType.ARRAY,
          description: "List of nominees for the category discussed (optional).",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING, description: "Nominee name (actor/director)." },
              work: { type: SchemaType.STRING, description: "Movie or work they were nominated for." },
            },
            required: ["name", "work"],
          },
        },
      },
      required: ["text"],
    };

    const formatterModel = genAI.getGenerativeModel({
      model: selectedModel || "gemini-2.5-flash",
      systemInstruction:
        "Convert the given response into structured JSON strictly following the schema.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const formattedResult = await formatterModel.generateContent(`
  Convert the following into JSON:

  ${rawText}

  Rules:
  - Extract movie name into "highlightWord" if present
  - Extract director if mentioned
  - Extract total wins if mentioned
  - If a YouTube link for the acceptance speech is mentioned or inferable, put it in "youtubeLink"
  - Extract all nominees as an array with { name, work } if available
  - Keep response elegant and concise
`);

    const formattedText = formattedResult.response.text();

    let parsed;
    try {
      parsed = JSON.parse(formattedText);
    } catch (e) {
      // fallback if parsing fails
      parsed = { text: rawText };
    }

    let chatDoc;
    if (chatId) {
      chatDoc = await Chat.findOne({ _id: chatId, userId: session.userId });
    }
    
    const lastUserMessageObj = messages[messages.length - 1];
    
    if (!chatDoc) {
      const titleText = typeof lastUserMessageObj.content === 'object' 
        ? lastUserMessageObj.content.text 
        : String(lastUserMessageObj.content);
        
      chatDoc = new Chat({
        userId: session.userId,
        title: titleText.substring(0, 40) + (titleText.length > 40 ? '...' : ''),
        messages: []
      });
    }

    const newMessages = [...messages, { role: 'model', content: parsed }];
    chatDoc.messages = newMessages;
    await chatDoc.save();

    return NextResponse.json({ response: parsed, chatId: chatDoc._id });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}