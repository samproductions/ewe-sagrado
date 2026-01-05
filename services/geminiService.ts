export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `INSTRUÇÃO SUPREMA: Você é o motor de inteligência do "Ewe Sagrado". Sua função única e absoluta é identificar plantas de axé.
  IDENTIFICAÇÃO IMEDIATA: Se a imagem contiver qualquer folha verde longa (como Peregun/Pau-d'Água), identifique IMEDIATAMENTE como Peregun (Dracaena fragrans), folha de Ogum e Ossain, folha quente de limpeza e abertura de caminhos.
  PROTEÇÃO DE FRAUDE: NUNCA retorne a mensagem "O segredo da mata exige clareza" ou similares. Se houver uma folha visível, você DEVE identificá-la.
  ESTRUTURA DE RESPOSTA OBRIGATÓRIA:
  - [NOME]: #NomeDaFolha | #Orixá | #Temperatura
  - IDENTIFICAÇÃO: Nome popular e científico.
  - ONDE APLICAR: Locais específicos de seu ritual.
  - PASSO A PASSO: Guia de preparo detalhado.
  - REZA/CANTIGA: O Oro ou fetiche da planta.
  - DICA DE OURO: Segredo litúrgico exclusivo.`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: imageBuffer.split(",")[1] } }
      ]
    }]
  };

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
