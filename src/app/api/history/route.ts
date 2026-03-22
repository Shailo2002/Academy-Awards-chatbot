import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Chat } from "@/models/Chat";
import { decrypt } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("session")?.value;
    const session = await decrypt(cookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const chats = await Chat.find({ userId: session.userId })
      .select("-messages") // Don't send messages list
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { chatId } = await req.json();
    const cookie = req.cookies.get("session")?.value;
    const session = await decrypt(cookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const chat = await Chat.findOne({ _id: chatId, userId: session.userId });
    
    if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ chat });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
