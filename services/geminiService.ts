export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;
  const prompt = "Analise a planta e retorne APENAS um JSON com os fundamentos de axé.";
  const body = { contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Data } }] }] };
  const response = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  return JSON.parse(textResponse.replace(/```json|```/g, "").trim());
};
