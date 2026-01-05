export const analyzePlantImage = async (imageBuffer: string) => {
  const apiKey = "AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Analise a planta e retorne APENAS um objeto JSON exatamente com esta estrutura, sem textos extras:
  {
    "scientificName": "Nome Científico",
    "commonName": "Peregun",
    "orixRuling": "Ogum",
    "fundamento": "Quente",
    "fundamentoExplanation": "Axé de limpeza e proteção",
    "eweClassification": "Ewe Pupa",
    "ritualNature": "Limpeza",
    "applicationLocation": ["Corpo", "Ori"],
    "stepByStepInstructions": ["Macerar em água fria", "Deixar descansar"],
    "prayer": { "title": "Oro de Ogum", "text": "Reza litúrgica da folha" },
    "goldenTips": { "title": "Segredo do Ewe", "content": "Dica para potencializar o axé" },
    "elements": "Ar/Terra",
    "historicalContext": "História ancestral da folha",
    "safetyWarnings": "Nenhum",
    "suggestedTitles": "Peregun: A Folha da Vitória"
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
    body: JSON.stringify(body)
  });

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  
  // Esta linha limpa qualquer comentário da IA e deixa apenas os dados puros
  const cleanJson = textResponse.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
