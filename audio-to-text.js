import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from "@google/genai";
import { writeFileSync, createReadStream } from "node:fs"
dotenv.config()

const openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
});

const googleAiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_API_KEY || '' });


async function generateOpenAiTextFromAudio(params) {
    const textResponse = await openAiClient.audio.transcriptions.create({
        model: "whisper-1",
        file: createReadStream("ground_truth.wav"),
        language: 'en'
    });

    console.log(textResponse);
    const rawText = textResponse.text;
    writeFileSync("autio.text", rawText, 'utf-8')
}

generateOpenAiTextFromAudio()

