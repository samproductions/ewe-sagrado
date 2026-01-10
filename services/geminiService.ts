import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzePlantImage = async (base64Image: string, retries = 2): Promise<PlantAnalysis> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("Configuração: Chave de API não detectada.");
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

  const prompt = `Você é um mestre botânico taxonômico e Oníṣègún da Nação Ketu.
Aja com a precisão do aplicativo PictureThis.
Analise a imagem focando em nervuras, margem foliar e filotaxia para identificação botânica real.
Após identificar a espécie, traga o fundamento litúrgico de Ketu.
Se a imagem estiver muito ruim para identificação, use o campo "safetyWarnings" para avisar.
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

    const text = response.text;
    if (!text) throw new Error("A leitura falhou.");
    return JSON.parse(text);

  } catch (error: any) {
    console.error("Erro na API:", error);

    // Se for erro de cota ou rede ocupada, esperamos 5 segundos para limpar o buffer do iPhone
    if ((error.status === 429 || error.message?.toLowerCase().includes("quota")) && retries > 0) {
      await delay(5000);
      return analyzePlantImage(base64Image, retries - 1);
    }

    if (error.status === 429 || error.message?.toLowerCase().includes("quota")) {
      throw new Error("O sistema está descansando devido ao excesso de fotos. Aguarde 60 segundos e tente novamente.");
    }

    throw new Error("Não foi possível firmar a imagem. Tente uma foto com fundo neutro e boa luz.");
  }
};