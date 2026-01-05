import { GoogleGenerativeAI } from "@google/generai";
import { PlantAnalysis } from "../types";

const genAI = new GoogleGenerativeAI("AIzaSyDwL3c0Jc4DEbRHIssrZKV_-FovTsTOyqY");

export const analyzePlant = async (imageBuffer: string): Promise<PlantAnalysis> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = "Analise esta planta e retorne os fundamentos litúrgicos de axé, Orixá regente e utilidade ritualística.";

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBuffer,
        mimeType: "image/jpeg"
      }
    }
  ]);

  const response = await result.response;
  return JSON.parse(response.text());
};
