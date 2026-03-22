"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChatLayout from "@/components/ChatLayout";
import MessageList, { Message } from "@/components/Chat/MessageList";
import ChatInput from "@/components/Chat/ChatInput";

function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get('chatId');

  useEffect(() => {
    if (chatId) {
      setIsLoading(true);
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.chat && data.chat.messages) {
          const formattedMessages = data.chat.messages.map((m: any, idx: number) => ({
            id: m._id || idx.toString(),
            role: m.role === 'model' ? 'assistant' : 'user', // Mapping model to assistant for UI compatibility
            content: m.content
          }));
          setMessages(formattedMessages);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
    } else {
      setMessages([]); // Reset on "New Chat"
    }
  }, [chatId]);

  const handleSend = async (content: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: typeof m.content === 'object' ? m.content.text || m.content : m.content
          })),
          model: "gemini-2.5-flash",
          chatId: chatId || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If this is a new chat, update URL silently to maintain context
      if (!chatId && data.chatId) {
        router.push(`/?chatId=${data.chatId}`);
      }

    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "The Academy is unavailable right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", display: 'flex', flexDirection: 'column' }}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSuggestionClick={handleSend}
        />
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </>
  );
}

export default function Home() {
  return (
    <ChatLayout>
      <Suspense fallback={<div style={{ padding: '2rem', color: '#D4AF37' }}>Loading...</div>}>
        <ChatArea />
      </Suspense>
    </ChatLayout>
  );
}
