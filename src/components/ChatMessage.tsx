import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.isAi;
  
  return (
    <div className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      {isAi && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Bot className="w-5 h-5 text-green-600" />
        </div>
      )}
      <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
        <div
          className={`max-w-[80%] px-4 py-2 rounded-lg ${
            isAi
              ? 'bg-white border border-green-200'
              : 'bg-green-600 text-white'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      {!isAi && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}