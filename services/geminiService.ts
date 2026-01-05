export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;

  const prompt = "Aja como Babalawo e Botânico. Identifique a planta nesta imagem e retorne APENAS um JSON com os campos: scientificName, commonName, orixaRuling, fundamento, fundamentoExplanation, eweClassification, ritualNature, applicationLocation (lista), stepByStepInstructions (lista), prayer (objeto com title e text), goldenTip (objeto com title e content), elements, historicalContext, safetyWarnings, suggestedTitle.";

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
  
  // Se o Google não responder, ele cai aqui
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("Falha na resposta da IA.");
  }

  const textResponse = data.candidates[0].content.parts[0].text;
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
