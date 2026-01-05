export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  // Mudamos o modelo para o flash-8b que tem menos restrições de cota
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`;

  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;

  const prompt = `Analise a planta de axé na imagem e retorne APENAS um objeto JSON com esta estrutura exata:
  {
    "scientificName": "Nome Científico",
    "commonName": "Nome Popular",
    "orixaRuling": "Orixá",
    "fundamento": "Quente/Fria/Morna",
    "fundamentoExplanation": "Explicação",
    "eweClassification": "Geral",
    "ritualNature": "Limpeza/Axé",
    "applicationLocation": ["Corpo"],
    "stepByStepInstructions": ["Instrução"],
    "prayer": { "title": "Reza", "text": "Texto" },
    "goldenTip": { "title": "Dica", "content": "Segredo" },
    "elements": "Elemento",
    "historicalContext": "História",
    "safetyWarnings": "Nenhum",
    "suggestedTitle": "Título da Análise"
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

  if (data.error) {
    throw new Error(data.error.message);
  }

  const textResponse = data.candidates[0].content.parts[0].text;
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
