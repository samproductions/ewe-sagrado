
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysis> => {
  // Inicialização direta conforme diretrizes: sempre usar process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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

  const prompt = `Você é um botânico sagrado especialista em Ewé (folhas de axé).
Identifique a planta na imagem e forneça o fundamento litúrgico completo (Candomblé/Umbanda).
Seja preciso na identificação botânica.
Retorne apenas o JSON.`;

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

    const responseText = response.text;
    if (!responseText) throw new Error("A folha não pôde ser revelada (Resposta vazia).");

    return JSON.parse(responseText);
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    // Se for erro de autenticação/chave, damos uma mensagem mais clara via catch
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('403')) {
      throw new Error("Erro de autenticação: Verifique se a chave de API no Vercel está correta e ativa.");
    }
    throw new Error(error.message || "Erro desconhecido ao consultar o axé da planta.");
  }
};
