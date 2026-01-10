
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysis> => {
  // Acessa a chave injetada pelo Vite via process.env.API_KEY (definida no vite.config.ts)
  const apiKey = (process.env as any).API_KEY;

  if (!apiKey || apiKey === "undefined") {
    console.error("ERRO: API_KEY não encontrada. Certifique-se de configurá-la no Vercel (Environment Variables).");
    throw new Error("Chave de API não configurada no servidor.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const PLANT_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      scientificName: { type: Type.STRING },
      commonName: { type: Type.STRING },
      orixaRuling: { type: Type.STRING },
      fundamento: { type: Type.STRING },
      fundamentoExplanation: { type: Type.STRING },
      eweClassification: { type: Type.STRING },
      ritualNature: { type: Type.STRING },
      applicationLocation: { type: Type.ARRAY, items: { type: Type.STRING } },
      stepByStepInstructions: { type: Type.ARRAY, items: { type: Type.STRING } },
      prayer: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          text: { type: Type.STRING }
        },
        required: ["title", "text"]
      },
      goldenTip: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "content"]
      },
      elements: { type: Type.STRING },
      historicalContext: { type: Type.STRING },
      safetyWarnings: { type: Type.STRING },
      suggestedTitle: { type: Type.STRING }
    },
    required: [
      "scientificName", "commonName", "orixaRuling", "fundamento", 
      "fundamentoExplanation", "eweClassification", "ritualNature", 
      "applicationLocation", "stepByStepInstructions", "prayer", 
      "goldenTip", "elements", "historicalContext", "suggestedTitle"
    ]
  };

  const prompt = `Você é um sistema de alta precisão botânica e litúrgica especializado em Ewé (folhas) de Candomblé e Umbanda.
Identifique a planta na imagem e retorne seus fundamentos.

DIRETRIZES:
1. Identificação Visual precisa.
2. Determine se é Gùn (quente) ou Èrowo (fria).
3. Forneça o Òfò (reza) em Iorubá com tradução.

Retorne APENAS o JSON conforme o esquema definido.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: PLANT_ANALYSIS_SCHEMA,
      }
    });

    const text = response.text;
    if (!text) throw new Error("O modelo retornou uma resposta vazia.");
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Erro detalhado na Gemini API:", error);
    throw error;
  }
};
