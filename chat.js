import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from "@google/genai";
dotenv.config()

async function openAIAnswer(data) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || ''
    });

    const response = await client.responses.create({
        model: "gpt-5.5",
        input: data
    });

    return response.output_text;
}

async function googleGenAIAnswer(data) {

    const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_GEN_AI_API_KEY || ''
    });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: data,
        });

        return response.text;
    } catch (error) {
        throw new Error(error.message);
    }

}

process.stdout.write("Ask question : ");
process.stdin.on("data", async (data) => {
    if (data.toString().trim() == "exit") {
        process.exit()
    }
    else {
        const output = await googleGenAIAnswer(data.toString().trim());
        console.log(output);
    }
})