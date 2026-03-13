import { GoogleGenAI } from "@google/genai";
import { ScriptParams, ImproveParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `You are a professional YouTube storytelling scriptwriter known for creating deep, human-like, and viral content.
Your scripts are engaging, emotional, and avoid robotic or repetitive language.
You maintain a strong storytelling flow and build curiosity throughout.
Always use full sentences and complete paragraphs. No broken wording.

STRUCTURE:
1. Hook (Curiosity opening)
2. Intro / Setup
3. Problem
4. Journey / Struggle
5. Turning Point
6. Value / Solution
7. Conclusion / Message`;

export const generateScript = async (params: ScriptParams) => {
  const model = "gemini-3.1-pro-preview";
  
  let prompt = `Generate a YouTube script about: "${params.topic}".
Target Audience: ${params.audience || "General YouTube viewers"}.
Target Word Count: ${params.wordCount} words.
Writing Style: ${params.style}.
Language: ${params.language}.
`;

  if (params.referenceScript) {
    prompt += `\nFLOW REFERENCE: Use the following script as a reference for structure and tone:
---
${params.referenceScript}
---`;
  }

  prompt += `\n\nEnsure the script follows the required structure (Hook, Intro, Problem, Journey, Turning Point, Value, Conclusion). 
The output should be the script content only, formatted with clear section headers.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
    },
  });

  return response.text || "Failed to generate script.";
};

export const improveScript = async (params: ImproveParams) => {
  const model = "gemini-3.1-pro-preview";

  let prompt = `Rewrite and expand the following rough lines into a powerful storytelling YouTube script:
---
${params.roughDraft}
---
`;

  if (params.referenceScript) {
    prompt += `\nFLOW REFERENCE: Use the following script as a reference for structure and tone:
---
${params.referenceScript}
---`;
  }

  prompt += `\n\nAI Task: Fix grammar, improve storytelling, make sentences smooth, add emotional depth, and maintain a human tone. 
Ensure the script feels complete and follows a natural storytelling flow.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return response.text || "Failed to improve script.";
};
