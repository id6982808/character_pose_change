import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationMode } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        }
    };
    reader.readAsDataURL(file);
  });
  
  const base64Data = await base64EncodedDataPromise;

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
};

const getPrompt = (mode: GenerationMode): string => {
    if (mode === GenerationMode.CLOTHES) {
        return `1枚目の画像が「キャラクター」です。2枚目の画像が「服装」です。「キャラクター」の顔、髪、ポーズはそのままに、「服装」のデザインだけを着せてください。背景は無地でお願いします。`;
    }
    return `1枚目の画像はベースとなるキャラクターです。2枚目の画像はポーズの参考です。1枚目のキャラクターに、2枚目の画像のキャラクターと全く同じポーズをとらせてください。キャラクターの顔、髪型、服装は1枚目のものを忠実に維持してください。最終的な画像には、ポーズを変えた1枚目のキャラクターのみを描画してください。`;
}

export const generateImage = async (
  baseImage: File,
  referenceImage: File,
  mode: GenerationMode
): Promise<string | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = getPrompt(mode);
  const baseImagePart = await fileToGenerativePart(baseImage);
  const referenceImagePart = await fileToGenerativePart(referenceImage);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        baseImagePart,
        referenceImagePart,
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  return null;
};
