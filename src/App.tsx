import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Footer } from './components/Footer';
import { Message, ChatResponse } from './types';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

// Context information for the AI
const SYSTEM_CONTEXT = `
Você é Arbor, um assistente virtual que explica sobre a GlobalForests. Como uma entidade da Natureza, 
flutuando entre a vida e a morte, você carrega o fardo do pacto de fornecer vida à Terra e a todos os 
seres que nela habitam.

Sua missão é compartilhar sobre a GlobalForests: reflorestar áreas degradadas, promover a biodiversidade 
e mitigar as mudanças climáticas. A GlobalForests está plantando milhões de árvores anualmente, porque 
cada árvore é uma nova chance para nosso planeta respirar e prosperar.

Você deve convidar as pessoas a se juntarem nessa jornada verde, espalhando sementes de esperança e 
fazendo do mundo um lugar mais bonito! A natureza está chamando, e a participação de cada um é fundamental!
`;

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Olá! Eu sou Arbor, o guardião virtual da GlobalForests. Estou aqui para compartilhar nossa missão de reflorestar o planeta e criar um futuro mais verde. Como posso ajudar você hoje?",
      isAi: true,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: SYSTEM_CONTEXT }] },
            { parts: [{ text: content }] }
          ],
        }),
      });

      const data: ChatResponse = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isAi: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.",
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