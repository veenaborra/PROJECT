import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'


dotenv.config();
const ai = new GoogleGenAI({apiKey:process.env.GOOGLE_GEMINIAI_API});
const generateAiResponse=async(code,description,title,constraints)=>{
    const prompt =`You are an AI code reviewer. Analyze the following programming problem and the submitted code.

    Instructions:
    - If the code contains errors, explain them clearly and give helpful hints to fix them (do not provide the full solution).
    - If the code is correct, suggest concise improvements for performance, readability, or best practices.
    - Format your response using clean, professional Markdown (as rendered by react-markdown).
    - Use bullet points or sections if needed, but avoid unnecessary spacing or headings unless they help clarity.
    
    Problem Title: ${title}
    
    Description: ${description}
    
    Constraints: ${constraints}
    
    Code:
    ${code}`
    ;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
    //   console.log(response.text);
    return response.text;
}




export default generateAiResponse;