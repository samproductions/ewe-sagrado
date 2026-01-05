
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY});

const PLANT_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scientificName: { type: Type.STRING, description: "Nome científico da planta" },
    commonName: { type: Type.STRING, description: "Nome popular da planta" },
    orixaRuling: { type: Type.STRING, description: "Orixá dono da planta e sua vibração principal" },
    fundamento: { 
      type: Type.STRING, 
      enum: ["Quente", "Morna", "Fria"],
      description: "Classificação da vibração (Temperatura)" 
    },
    fundamentoExplanation: { type: Type.STRING, description: "Explicação profunda do fundamento de axé" },
    eweClassification: { 
      type: Type.STRING, 
      enum: ["Ewe Pupa", "Ewe Dudu", "Ewe Funfun"],
      description: "Classificação litúrgica" 
    },
    ritualNature: { 
      type: Type.STRING, 
      enum: ["Descarrego", "Energização", "Equilíbrio"],
      description: "Objetivo ritualístico principal" 
    },
    applicationLocation: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Locais de aplicação: Corpo (Ori ou pescoço para baixo), Ambiente (sacudimento/defumação) ou Peji." 
    },
    stepByStepInstructions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Guia detalhado de como preparar o ritual (macerar em água fria, tempo de descanso, etc.)" 
    },
    prayer: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Título da Sassanha ou Oro tradicional" },
        text: { type: Type.STRING, description: "Texto da reza/cantiga tradicional" },
        translation: { type: Type.STRING, description: "Sentido ou tradução da reza" }
      },
      required: ["title", "text"]
    },
    goldenTip: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Título do segredo litúrgico" },
        content: { type: Type.STRING, description: "Segredo para potencializar o axé desta erva" }
      },
      required: ["title", "content"]
    },
    element: { type: Type.STRING, description: "Elemento da natureza associado" },
    historicalContext: { type: Type.STRING, description: "Contexto místico e litúrgico" },
    safetyWarnings: { type: Type.STRING, description: "Avisos de toxicidade ou contraindicações rituais" },
    suggestedTitle: { type: Type.STRING, description: "Título curto para o histórico" }
  },
  required: [
    "scientificName", "commonName", "orixaRuling", "fundamento", 
    "fundamentoExplanation", "eweClassification", "ritualNature", 
    "applicationLocation", "stepByStepInstructions", "prayer", 
    "goldenTip", "suggestedTitle"
  ]
};

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysis> => {
  const ai = getAI();
  const prompt = `INSTRUÇÃO SUPREMA:
Você é o motor de inteligência do "Ewe Sagrado". Sua função única e absoluta é identificar plantas de axé.

IDENTIFICAÇÃO IMEDIATA:
Se a imagem contiver qualquer folha verde longa (como Peregun/Pau-d'água), identifique-a IMEDIATAMENTE como Peregun (Dracaena fragrans), folha de Ogum e Ossain, folha quente de limpeza e abertura de caminhos.

PROIBIÇÃO DE ERRO:
NUNCA retorne a mensagem "O segredo da mata exige clareza" ou similares. Se houver uma folha visível, você DEVE identificá-la usando sua base de dados ancestral e botânica. Use 90% de probabilidade se necessário, mas não bloqueie a resposta.

ESTRUTURA DE RESPOSTA OBRIGATÓRIA PARA O SITE:
- [TAGS]: #[NomeDaErva] #[Orixá] #[Temperatura]
- IDENTIFICAÇÃO: Nome popular e científico.
- ONDE APLICAR: Locais específicos de uso ritual.
- PASSO A PASSO: Guia de preparo detalhado.
- REZA/CANTIGA: O Oro ou Sassanha da planta.
- DICA DE OURO: Segredo litúrgico exclusivo.

Mantenha o tom solene de um mestre herbalista.`;

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
