export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;

  const prompt = `Você é um especialista em botânica litúrgica. Analise a imagem e identifique a planta.
  Retorne APENAS um objeto JSON com esta estrutura exata:
  {
    "scientificName": "Nome científico real",
    "commonName": "Nome popular real",
    "orixaRuling": "Orixá regente",
    "fundamento": "Quente/Fria/Morna",
    "fundamentoExplanation": "Explicação do axé",
    "eweClassification": "Classificação",
    "ritualNature": "Uso ritualístico",
    "applicationLocation": ["Local"],
    "stepByStepInstructions": ["Passo 1"],
    "prayer": { "title": "Título", "text": "Reza" },
    "goldenTip": { "title": "Dica", "content": "Segredo" },
    "elements": "Elemento",
    "historicalContext": "História",
    "safetyWarnings": "Avisos",
    "suggestedTitle": "Título da Análise"
  }`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Data } }] }]
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("A mata não revelou seus segredos. Tente uma foto mais clara.");
  }

  const textResponse = data.candidates[0].content.parts[0].text;
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
