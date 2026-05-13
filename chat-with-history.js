import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from "@google/genai";
dotenv.config()

const openAiContext = [{
    role: 'system',
    content: 'keep answer short and simple'
}];

const genAIContext = [{
    role: 'user',
    parts: [{ text: 'keep answer short and simple' }]
}];

async function openAIAnswerWithHistory(data) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || ''
    });

    openAiContext.push({
        role: 'user',
        content: data
    })

    const response = await client.responses.create({
        model: "gpt-5.5",
        content: openAiContext
    });

    openAiContext.push({
        role: 'assistant',
        content: response.output_text
    })

    return response.output_text;
}

async function googleGenAIAnswerrWithHistory(data) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

        genAIContext.push({
            role: 'user',
            parts: [{ text: data }]
        })

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: genAIContext
        });

        genAIContext.push({
            role: 'model',
            parts: [{ text: response.text }]
        })

        return response.text;
    } catch (error) {
        console.error("Error calling Google GenAI:", error);
        throw error;
    }
}

process.stdout.write("Ask question : ");
process.stdin.on("data", async (data) => {
    if (data.toString().trim() == "exit") {
        process.exit()
    }
    else {
        const output = await googleGenAIAnswerrWithHistory(data.toString().trim());
        console.log(output);
    }
})