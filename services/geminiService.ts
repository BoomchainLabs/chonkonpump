import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_ORACLE, SYSTEM_INSTRUCTION_RATER } from '../constants';
import { ChonkRating } from '../types';

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

export const getOracleResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ORACLE,
        temperature: 0.9,
      },
    });
    return response.text || "The Oracle is meditating on the roundness of the universe...";
  } catch (error) {
    console.error("Oracle Error:", error);
    return "The Oracle is currently disconnected from the blockchain spirit realm. Try again.";
  }
};

export const rateChonkImage = async (base64Image: string, mimeType: string): Promise<ChonkRating> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using flash for speed/vision
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