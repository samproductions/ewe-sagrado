export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const base64Data = imageBuffer.includes(",") ? imageBuffer.split(",")[1] : imageBuffer;

  const body = {
    contents: [{
      parts: [
        { text: "Identifique esta planta de axé. Retorne o nome, orixá e fundamento em um parágrafo curto." },
        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
      ]
    }]
  };

  const response = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
  const data = await response.json();
  
  // Retorna apenas o texto, sem tentar montar um JSON complicado
  return data.candidates[0].content.parts[0].text;
};
