export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Analise a planta e retorne APENAS um objeto JSON com esta estrutura exata, sem textos extras:
  {
    "scientificName": "Nome científico",
    "commonName": "Peregun",
    "orixRuling": "Ogum",
    "fundamento": "Quente",
    "fundamentoExplanation": "Explicação do axé",
    "eweClassification": "Ewe Pupa",
    "ritualNature": "Limpeza",
    "applicationLocation": ["Corpo"],
    "stepByStepInstructions": ["Instrução 1"],
    "prayer": { "title": "Oro", "text": "Reza" },
    "goldenTips": { "title": "Dica", "content": "Segredo" },
    "elements": "Ar",
    "historicalContext": "História",
    "safetyWarnings": "Nenhum",
    "suggestedTitles": "Título"
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
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  
  // Garante que o sistema leia apenas o JSON puro
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
