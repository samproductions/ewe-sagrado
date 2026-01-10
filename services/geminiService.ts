import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzePlantImage = async (base64Image: string, retries = 3): Promise<PlantAnalysis> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("Erro: API Key não configurada corretamente.");
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
          text: { type: Type.STRING },
          translation: { type: Type.STRING }
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

  // Usando Flash Lite para garantir maior estabilidade em contas gratuitas
  const model = 'gemini-flash-lite-latest';

  const prompt = `Identifique a planta nesta foto focando na taxonomia (nervuras, bordas).
Atue como um Oníṣègún experiente de Ketu para explicar o Axé da folha.
Retorne o JSON conforme o esquema definido.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
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
    if (!text) throw new Error("A resposta da API voltou vazia.");
    return JSON.parse(text);

  } catch (error: any) {
    console.error("Erro na Chamada:", error);

    // Erro 429 (Quota) - Espera exponencial maior
    if ((error.status === 429 || error.message?.toLowerCase().includes("quota")) && retries > 0) {
      const waitTime = (4 - retries) * 8000; // 8s, 16s, 24s
      await delay(waitTime);
      return analyzePlantImage(base64Image, retries - 1);
    }

    if (error.status === 429 || error.message?.toLowerCase().includes("quota")) {
      throw new Error("O tráfego de Axé está intenso. Aguarde 60 segundos para que a cota do Google se renove.");
    }

    throw new Error("Não conseguimos ler a folha agora. Tente novamente com mais luz.");
  }
};