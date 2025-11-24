
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_ORACLE, SYSTEM_INSTRUCTION_RATER, SYSTEM_INSTRUCTION_TRIVIA } from '../constants';
import { ChonkRating, TriviaQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketSentiment = async (pumpCount: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a hype-man for a meme coin called $CHONK9K. The user has pumped the coin ${pumpCount} times.
      Provide a short, hilarious, and extremely bullish "vibe check" (1 sentence). Use crypto slang like WAGMI, moon, diamond hands, ape in, etc.`,
    });
    return response.text || "Vibes are astronomically high.";
  } catch (error) {
    console.error("Sentiment Error:", error);
    return "Vibe check failed, but the chart looks green.";
  }
};

export const getOracleResponse = async (userMessage: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ORACLE,
        temperature: 0.9,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "The Oracle is meditating on the roundness of the universe...";
    
    const sources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Oracle Error:", error);
    return { text: "The Oracle is currently disconnected from the blockchain spirit realm. Try again." };
  }
};

export const rateChonkImage = async (base64Image: string, mimeType: string): Promise<ChonkRating> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for multimodal vision + JSON
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Analyze this image. If it is an animal, rate its chonkiness.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_RATER,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                verdict: { type: Type.STRING },
                humorousTake: { type: Type.STRING },
            },
            required: ["score", "verdict", "humorousTake"],
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Chonk Adjudicator");
    
    return JSON.parse(text) as ChonkRating;
  } catch (error) {
    console.error("Rater Error:", error);
    throw new Error("Could not judge the chonk. Is the image valid?");
  }
};

export const generateTriviaQuestions = async (): Promise<TriviaQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate 5 crypto and chonk meme trivia questions.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TRIVIA,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No trivia generated");
    
    const data = JSON.parse(text);
    return data.questions as TriviaQuestion[];

  } catch (error) {
    console.error("Trivia Gen Error:", error);
    // Fallback questions in case API fails
    return [
      {
        question: "What does 'WAGMI' stand for?",
        options: ["We All Get Money Instantly", "We Are Gonna Make It", "Whales Are Getting More Interesting", "Why Are Gophers Mostly Invisible"],
        correctAnswerIndex: 1,
        explanation: "It's the rallying cry of the crypto optimistic: We're All Gonna Make It!"
      },
      {
        question: "Which animal is the mascot of Dogecoin?",
        options: ["Golden Retriever", "Shiba Inu", "Chihuahua", "Bulldog"],
        correctAnswerIndex: 1,
        explanation: "The Shiba Inu is the face of the original meme coin."
      }
    ];
  }
}
