import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from "@google/genai";
import { writeFileSync } from "node:fs"
dotenv.config()

const openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
});

const googleAiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_API_KEY || '' });

async function generateOpenAiImage(params) {
    const response = await openAiClient.images.generate({
        model: 'dall-e-2',
        prompt: "Generate image for heart shape chocolate",
        response_format: 'b64_json',
        size: "256x256",
        n: 1
        // model: 'gpt-image-1.5',
        // prompt: "Generate image for heart shape chocolate",
        // n: 1
    });

    const image_base64 = response.data[0].b64_json;

    const buffer = Buffer.from(image_base64, "base64");

    writeFileSync("./generatedImage.png", buffer);
}

generateOpenAiImage()

async function generateGoogleAiImage(params) {

    const response = await googleAiClient.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: "Generate image for heart shape chocolate",
        config: {
            responseModalities: ['IMAGE'],
            responseFormat: {
                image: {
                    aspectRatio: '1:1',
                    imageSize: '1K',
                }
            },
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            console.log(part.text);
        } else if (part.inlineData) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, "base64");
            writeFileSync("image.png", buffer);
            console.log("Image saved as image.png");
        }
    }
}