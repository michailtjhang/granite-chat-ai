'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, MessageSquare, Plus } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  // Auto-scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let chatId = currentChatId;
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date()
      };
      setChats(prev => [newChat, ...prev]);
      chatId = newChat.id;
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.messages.length === 0
                  ? userMessage.content.slice(0, 30) +
                    (userMessage.content.length > 30 ? '...' : '')
                  : chat.title
            }
          : chat
      )
    );

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(currentChat?.messages || []), userMessage]
        })
      });

      const data = await response.json();

      let messageText: string = "";

      try {
        // kalau ternyata string JSON, parse
        if (typeof data.message === "string" && data.message.trim().startsWith("{")) {
          const parsed = JSON.parse(data.message);
          messageText = parsed.content || data.message;
        } else {
          messageText = data.message;
        }
      } catch {
        messageText = data.message;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: messageText,
        timestamp: new Date()
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        )
      );
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Error, please try again.',
        timestamp: new Date()
      };
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-sidebar-bg glass flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-2 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`flex items-center justify-between w-full p-3 text-left hover:bg-gray-700 transition-colors border-l-2 ${
                currentChatId === chat.id
                  ? 'bg-gray-700 border-l-blue-500'
                  : 'border-l-transparent'
              }`}
            >
              {/* Klik judul chat untuk open */}
              <button
                onClick={() => setCurrentChatId(chat.id)}
                className="flex items-center gap-2 flex-1 truncate"
              >
                <MessageSquare size={14} />
                <span className="text-sm truncate">{chat.title}</span>
              </button>

              {/* Tombol hapus */}
              <button
                onClick={() => setChats(prev => prev.filter(c => c.id !== chat.id))}
                className="ml-2 text-gray-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-chat-bg">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between glass">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <MessageSquare size={20} />
            </button>
            <h1 className="text-xl font-semibold gradient-text">
              IBM Granite Chat
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot size={64} className="mb-4" />
              <h2 className="text-2xl font-semibold mb-2 gradient-text">
                IBM Granite AI
              </h2>
              <p>Start a conversation by sending a message below</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-4 message-appear ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`p-4 rounded-2xl shadow-md max-w-md ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 glass">
          <form onSubmit={sendMessage} className="max-w-7xl mx-auto">
            <div className="relative flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-12 bg-gray-900/50 border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 resize-none min-h-[44px] max-h-32"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press <span className="font-semibold">Enter</span> to send,{' '}
              <span className="font-semibold">Shift+Enter</span> for new line
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
