export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;

  const prompt = `Analise a planta e retorne APENAS um objeto JSON exatamente com esta estrutura:
  {
    "scientificName": "Nome Científico",
    "commonName": "Peregun",
    "orixRuling": "Ogum",
    "fundamento": "Quente",
    "fundamentoExplanation": "Axé de limpeza e proteção",
    "eweClassification": "Ewe Pupa",
    "ritualNature": "Limpeza",
    "applicationLocation": ["Corpo"],
    "stepByStepInstructions": ["Macerar em água"],
    "prayer": { "title": "Oro", "text": "Reza" },
    "goldenTips": { "title": "Dica", "content": "Segredo" },
    "elements": "Ar/Terra",
    "historicalContext": "História",
    "safetyWarnings": "Nenhum",
    "suggestedTitles": "Peregun"
  }`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
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
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
