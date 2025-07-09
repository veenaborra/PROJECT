import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'


dotenv.config();
const ai = new GoogleGenAI({apiKey:process.env.GOOGLE_GEMINIAI_API});
const generateAiResponse=async(code,description,title,constraints)=>{
    const prompt = `
    Analyze the following programming problem and code. Be professional and concise.
    
    If the code contains errors, give helpful hints to fix them (do not provide the full solution).
    If the code is correct, suggest concise performance or readability improvements.
    Format the response using Markdown (the output will be rendered with react-markdown).
    Avoid unnecessary spacing or line breaks in the output.
   
    
    Title:
    ${title}
    
    Description:
    ${description}
    
    Constraints:
    ${constraints}
    
    Code:
    ${code}
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
    //   console.log(response.text);
    return response.text;
}




export default generateAiResponse;