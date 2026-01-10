import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysis> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("Chave de API não configurada. Verifique as variáveis de ambiente no Vercel.");
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
          title: { type: Type.STRING, description: "Título do Òfò ou Reza" },
          text: { type: Type.STRING, description: "O texto original da reza em Yorùbá (liturgia de Candomblé)" },
          translation: { type: Type.STRING, description: "Tradução literal ou livre para o Português" }
        },
        required: ["title", "text", "translation"]
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

  const prompt = `Você é um Babalawo e botânico sagrado especialista em Ewé (folhas de axé).
Identifique a planta na imagem e forneça o fundamento litúrgico exclusivo da tradição de Candomblé.
A reza (Òfò) DEVE ser em Yorùbá original com os acentos tonais corretos (ẹ, ọ, ṣ, etc.) e sua respectiva tradução para o português.
Explique detalhadamente por que essa folha pertence ao Orixá mencionado.
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
    if (!responseText) throw new Error("A folha não pôde ser revelada.");

    return JSON.parse(responseText);
  } catch (error: any) {
    console.error("Erro na API:", error);
    const msg = error.message || "";
    if (msg.includes("leaked") || msg.includes("PERMISSION_DENIED")) {
      throw new Error("Sua chave de API foi bloqueada por vazamento. Gere uma nova no Google AI Studio.");
    }
    throw new Error("Erro ao consultar o axé da planta. Verifique sua conexão e chave de API.");
  }
};