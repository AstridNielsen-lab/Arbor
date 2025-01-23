export interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}