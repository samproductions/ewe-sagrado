import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzePlantImage = async (base64Image: string, retries = 2): Promise<PlantAnalysis> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("Erro de Configuração: Chave de API não encontrada.");
  }

  // Criamos uma nova instância a cada chamada para garantir o estado limpo
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

  const prompt = `Aja como o aplicativo PictureThis para identificação botânica precisa (nervuras, margens).
Em seguida, aja como um Oníṣègún de Ketu para o fundamento ritual.
Identifique a planta na foto e retorne o JSON detalhado.`;

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
    if (!text) throw new Error("Vazio");
    return JSON.parse(text);

  } catch (error: any) {
    console.error("Gemini Error:", error);

    // Se for erro de cota (429), esperamos um tempo progressivo (Backoff)
    if ((error.status === 429 || error.message?.toLowerCase().includes("quota")) && retries > 0) {
      const waitTime = (3 - retries) * 6000; // 6s na primeira falha, 12s na segunda
      await delay(waitTime);
      return analyzePlantImage(base64Image, retries - 1);
    }

    if (error.status === 429 || error.message?.toLowerCase().includes("quota")) {
      throw new Error("O oráculo está recebendo muitas imagens. Por favor, aguarde 60 segundos para o axé se renovar e tente novamente.");
    }

    throw new Error("Não foi possível firmar a imagem. Tente uma foto com fundo liso e luz natural.");
  }
};