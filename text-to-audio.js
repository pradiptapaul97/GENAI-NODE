import OpenAI from "openai";
import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }))
dotenv.config();
const client = new OpenAI({ apiKey: process.env.openAI_Key })


app.get("/", (req, resp) => {
    resp.send(`<form action="/audio" method="post" >
    <input type="text" name="inputData" />
    <br/>
    <br/>

    <button> Convert Text in Audio </button>

    </form>`)
})

app.post("/audio", async (req, resp) => {


    const response = await client.audio.speech.create({
        model: "gpt-4o-mini-tts",
        input: req?.body?.inputData,
        voice: "coral",
        language: "hi"
    });

    const baseResponse = Buffer.from(await response.arrayBuffer())

    writeFileSync("audio2.mp3", baseResponse)
    console.log(baseResponse)

    resp.send("Text converted to audio")


})

app.listen(3200)