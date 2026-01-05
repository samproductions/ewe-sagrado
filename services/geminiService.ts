export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Analise a planta e retorne um JSON com: scientificName, commonName (coloque Peregun se for folha longa), orixRuling (Ogum), fundamento (Quente), fundamentoExplanation, eweClassification, ritualNature, applicationLocation (lista), stepByStepInstructions (lista), prayer (objeto com title e text), goldenTips (objeto com title e content), elements, historicalContext, safetyWarnings, suggestedTitles.`;

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
  
  // Limpeza para garantir que o site entenda os dados
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
