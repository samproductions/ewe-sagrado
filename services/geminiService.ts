
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzePlantImage = async (base64Image: string, retries = 2): Promise<PlantAnalysis> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("Configuração pendente: A Chave de API não foi encontrada. Verifique as configurações de ambiente.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const PLANT_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      scientificName: { type: Type.STRING },
      commonName: { type: Type.STRING },
      orixaRuling: { type: Type.STRING },
      fundamento: { type: Type.STRING, description: "Ewé Erò (Fria/Calma) ou Ewé Gun (Quente/Estimulante)" },
      fundamentoExplanation: { type: Type.STRING },
      eweClassification: { type: Type.STRING, description: "Classificação em Ewé Pupa, Dudu ou Funfun" },
      ritualNature: { type: Type.STRING },
      applicationLocation: { type: Type.ARRAY, items: { type: Type.STRING } },
      stepByStepInstructions: { type: Type.ARRAY, items: { type: Type.STRING } },
      prayer: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          text: { type: Type.STRING, description: "Òfò original em Yorùbá com acentuação correta" },
          translation: { type: Type.STRING, description: "Tradução para o português" }
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
      historicalContext: { type: Type.STRING, description: "O Itan ou história da folha na Nação Ketu" },
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

  const prompt = `Você é um mestre Oníṣègún especializado em Ewé (folhas) na Nação Ketu do Candomblé.
Analise a imagem e identifique a folha sagrada com absoluta precisão botânica e litúrgica.
Sua resposta deve focar estritamente nas tradições de Ketu.
O Òfò (encantamento) deve ser em Yorùbá clássico com a tradução.
Explique o uso ritual conforme a prática de Ketu.
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
    if (!text) throw new Error("As folhas não responderam ao chamado. Tente uma foto mais nítida.");
    return JSON.parse(text);

  } catch (error: any) {
    console.error("Erro na API Gemini:", error);

    // Se for erro de cota e ainda houver tentativas, espera 4 segundos (mais tempo de respiro)
    if ((error.status === 429 || error.message?.toLowerCase().includes("quota")) && retries > 0) {
      await delay(4000);
      return analyzePlantImage(base64Image, retries - 1);
    }

    // Tradução amigável do erro para o usuário
    if (error.status === 429 || error.message?.toLowerCase().includes("quota")) {
      throw new Error("O sistema está recebendo muitas consultas. Aguarde cerca de 1 minuto para o axé se renovar e tente novamente.");
    }

    if (error.message?.includes("API key not valid")) {
      throw new Error("Houve um erro técnico com a chave de acesso. Verifique as configurações.");
    }

    throw new Error("As folhas estão em silêncio no momento. Verifique sua conexão e tente uma foto com melhor iluminação.");
  }
};
