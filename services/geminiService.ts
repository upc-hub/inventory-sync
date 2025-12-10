import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateItemDetails = async (itemName: string, category: string): Promise<AIAnalysisResponse | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a short, sales-focused description in Burmese language (Myanmar) and a list of 3 potential technical specifications (can be English or Burmese mixed) for a vehicle part named "${itemName}" in the category "${category}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedDescription: {
              type: Type.STRING,
              description: "A compelling 1-sentence marketing description in Burmese."
            },
            technicalSpecs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 3 likely technical specs."
            }
          },
          required: ["suggestedDescription", "technicalSpecs"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIAnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};