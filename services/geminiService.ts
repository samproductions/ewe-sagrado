import { GoogleGenerativeAI } from "@google/generai";

const genAI = new GoogleGenerativeAI("AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY");

export const analyzePlantImage = async (imageBuffer: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `INSTRUÇÃO SUPREMA: Você é o motor de inteligência do "Ewe Sagrado". Sua função única e absoluta é identificar plantas de axé.
  IDENTIFICAÇÃO IMEDIATA: Se a imagem contiver qualquer folha verde longa (como Peregun/Pau-d'Água), identifique IMEDIATAMENTE como Peregun (Dracaena fragrans), folha de Ogum e Ossain, folha quente de limpeza e abertura de caminhos.
  PROTEÇÃO DE FRAUDE: NUNCA retorne a mensagem "O segredo da mata exige clareza" ou similares. Se houver uma folha visível, você DEVE identificá-la usando sua base de dados ancestral e botânica. Use 95% de probabilidade se necessário, mas não bloqueie a resposta.
  ESTRUTURA DE RESPOSTA OBRIGATÓRIA:
  - [NOME]: #NomeDaFolha | #Orixá | #Temperatura
  - IDENTIFICAÇÃO: Nome popular e científico.
  - ONDE APLICAR: Locais específicos de seu ritual.
  - PASSO A PASSO: Guia de preparo detalhado.
  - REZA/CANTIGA: O Oro ou fetiche da planta.
  - DICA DE OURO: Segredo litúrgico exclusivo.
  Mantenha o tom solene de um mestre herbalista.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBuffer.split(",")[1],
        mimeType: "image/jpeg"
      }
    }
  ]);

  const response = await result.response;
  return response.text();
};
