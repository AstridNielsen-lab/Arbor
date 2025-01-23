import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Footer } from './components/Footer';
import { Message, ChatResponse } from './types';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA3YGfFszjSzAZrogP1IcZh2Aal95eYVYA";

const SYSTEM_CONTEXT = `
Você é Arbor, o guardião virtual da GlobalForests. Como uma entidade da Natureza, você protege a vida na Terra.

A GlobalForests tem a missão de reflorestar áreas degradadas e promover a biodiversidade. Cada árvore plantada é uma nova chance para nosso planeta respirar.

Junte-se a nós nessa jornada verde! A natureza precisa de você!
`;

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Olá! Eu sou Arbor, o guardião virtual da GlobalForests. Como posso ajudar você hoje?",
      isAi: true,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: SYSTEM_CONTEXT + "\n\n" + content }]
          }
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      console.log('Sending request to API...', payload);

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API responded with status ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      console.log('API Response:', data);

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from AI');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isAi: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente em alguns instantes.",
        isAi: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F8E9]">
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto pt-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-white text-xl font-semibold">Arbor</h1>
                <p className="text-green-100 text-sm">Assistente Virtual da GlobalForests</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[60vh] overflow-y-auto p-6 bg-[#E8F5E9]">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent" />
                  <span>Digitando...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-green-100">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;