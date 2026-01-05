export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;

  const prompt = `Aja como um Babalawo e Botânico. Identifique a planta nesta imagem. 
  Se for Boldo, identifique como Boldo. Se for Peregun, identifique como Peregun.
  Retorne APENAS um JSON exatamente assim:
  {
    "scientificName": "Nome Científico",
    "commonName": "Nome Popular",
    "orixaRuling": "Orixá Regente",
    "fundamento": "Quente/Fria/Morna",
    "fundamentoExplanation": "Explicação curta",
    "eweClassification": "Classificação",
    "ritualNature": "Uso",
    "applicationLocation": ["Local"],
    "stepByStepInstructions": ["Passo 1"],
    "prayer": { "title": "Reza", "text": "Texto" },
    "goldenTip": { "title": "Segredo", "content": "Dica" },
    "elements": "Elemento",
    "historicalContext": "História",
    "safetyWarnings": "Avisos",
    "suggestedTitle": "Título"
  }`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
      ]}]
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  
  // Se a IA falhar, o erro aparecerá aqui
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("A IA não conseguiu analisar a imagem.");
  }

  const textResponse = data.candidates[0].content.parts[0].text;
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
