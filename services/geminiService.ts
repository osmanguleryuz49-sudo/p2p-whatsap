
import { GoogleGenAI } from "@google/genai";
import { Message, Contact } from "../types";

// Always use the named parameter and process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIResponse = async (contact: Contact, history: Message[]): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const chatHistory = history.map(msg => ({
    role: msg.senderId === 'me' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const systemInstruction = `
    You are ${contact.name}. 
    Your personality: ${contact.persona}.
    Instructions:
    - Respond in Turkish (Türkçe).
    - Keep responses concise and natural, as if you are texting on WhatsApp.
    - Do not mention you are an AI.
    - Use emojis where appropriate for your personality.
    - Address the user naturally.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: chatHistory.length > 0 ? chatHistory : [{ role: 'user', parts: [{ text: 'Merhaba!' }] }],
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // Directly access .text property from GenerateContentResponse
    return response.text || "Pardon, bir sorun oluştu. Tekrar söyler misin?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Şu an cevap veremiyorum, sanırım bağlantımda bir sorun var.";
  }
};
