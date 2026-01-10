
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const PLANT_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scientificName: { type: Type.STRING, description: "Nome científico da planta" },
    commonName: { type: Type.STRING, description: "Nome popular da planta" },
    orixaRuling: { type: Type.STRING, description: "Nome do Orixá que rege a folha" },
    fundamento: { 
      type: Type.STRING, 
      enum: ["Quente", "Morna", "Fria"],
      description: "Classificação da vibração (Temperatura)" 
    },
    fundamentoExplanation: { type: Type.STRING, description: "Explicação do axé e uso na liturgia" },
    eweClassification: { 
      type: Type.STRING, 
      description: "Classificação litúrgica (ex: Ewé Funfun, Ewé Pupa, Ewé Dúdú)" 
    },
    ritualNature: { 
      type: Type.STRING, 
      description: "Uso ritualístico principal (ex: Àgbo, Banho, Sacudimento)" 
    },
    applicationLocation: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Locais específicos de aplicação ritualística" 
    },
    stepByStepInstructions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Guia detalhado de preparo (colheita, maceração, etc.)" 
    },
    prayer: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Título da reza (Òfò / Àdúrà)" },
        text: { type: Type.STRING, description: "Texto da reza em Iorubá e tradução para o Português" }
      },
      required: ["title", "text"]
    },
    goldenTip: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Título do Èèwò ou Segredo" },
        content: { type: Type.STRING, description: "Dica de preceito ou como potencializar o axé" }
      },
      required: ["title", "content"]
    },
    elements: { type: Type.STRING, description: "Elemento da natureza associado (Terra/Fogo/Água/Ar)" },
    historicalContext: { type: Type.STRING, description: "Contexto místico e história da folha no culto" },
    safetyWarnings: { type: Type.STRING, description: "Avisos sobre toxicidade ou restrições de segurança" },
    suggestedTitle: { type: Type.STRING, description: "Título curto para a análise" }
  },
  required: [
    "scientificName", "commonName", "orixaRuling", "fundamento", 
    "fundamentoExplanation", "eweClassification", "ritualNature", 
    "applicationLocation", "stepByStepInstructions", "prayer", 
    "goldenTip", "elements", "historicalContext", "safetyWarnings", "suggestedTitle"
  ]
};

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysis> => {
  const ai = getAI();
  const prompt = `Você é o motor de inteligência artificial do app Ewe Expert, uma ferramenta de alta precisão botânica e litúrgica no nível do PictureThis. Sua missão é identificar plantas através de imagens e fornecer seus fundamentos para as religiões de matriz africana (Umbanda e Candomblé).

DIRETRIZES DE ANÁLISE:
1. Identificação Visual: Analise primeiro as características botânicas (nervuras, bordas das folhas, disposição no caule) para garantir precisão científica.
2. Regras Específicas: Se a imagem for um Boldo, identifique como Boldo (Peumus boldus ou Plectranthus barbatus); não confunda com Peregun.
3. Conhecimento de Axé: Determine se a folha é Gùn (quente/agressiva) ou Èrowo (fria/calma) e sua classificação (Ewé Funfun, Ewé Pupa, Ewé Dúdú).
4. Reza (Òfò): Forneça a reza litúrgica tradicional em Iorubá (quando aplicável) com sua tradução para o português no campo 'text' da oração.

FORMATO DE SAÍDA (OBRIGATÓRIO): Retorne APENAS um objeto JSON puro, sem textos explicativos fora dele, seguindo rigorosamente a estrutura solicitada.`;

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

  return JSON.parse(response.text);
};
