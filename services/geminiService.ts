export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  // Limpa a imagem para o formato que o Google aceita
  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;

  const prompt = "Analise a planta e retorne APENAS um JSON com: scientificName, commonName, orixRuling, fundamento, fundamentoExplanation, eweClassification, ritualNature, applicationLocation (lista), stepByStepInstructions (lista), prayer (objeto com title e text), goldenTips (objeto com title e content), elements, historicalContext, safetyWarnings, suggestedTitles.";

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
  
  // Limpa a resposta da IA para o site não travar
  return JSON.parse(textResponse.replace(/```json|```/g, "").trim());
};
