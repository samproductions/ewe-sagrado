export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Analise a planta e retorne APENAS um objeto JSON exatamente assim, sem textos extras:
  {
    "scientificName": "Nome",
    "commonName": "Peregun",
    "orixRuling": "Ogum",
    "fundamento": "Quente",
    "fundamentoExplanation": "Axé de limpeza",
    "eweClassification": "Ewe Pupa",
    "ritualNature": "Limpeza",
    "applicationLocation": ["Corpo"],
    "stepByStepInstructions": ["Macerar em água"],
    "prayer": { "title": "Oro", "text": "Reza de Ogum" },
    "goldenTips": { "title": "Segredo", "content": "Dica litúrgica" },
    "elements": "Ar/Terra",
    "historicalContext": "Contexto",
    "safetyWarnings": "Nenhum",
    "suggestedTitles": "Peregun de Ogum"
  }`;

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
    body: JSON.stringify(body)
  });

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  
  // Esta linha é o segredo: ela limpa o texto e transforma em dados que o site aceita
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
