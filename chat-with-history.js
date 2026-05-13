import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config()

const context = [{
    role: 'system',
    content: 'keep answer short and simple'
}]

async function openAIAnswer(data) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || ''
    });

    context.push({
        role: 'user',
        content: data
    })

    const response = await client.responses.create({
        model: "gpt-5.5",
        input: data
    });

    context.push({
        role: 'assistant',
        content: response.output_text
    })

    return response.output_text;
}

process.stdout.write("Ask question : ");
process.stdin.on("data", async (data) => {
    if (data.toString().trim() == "exit") {
        process.exit()
    }
    else {
        const output = await openAIAnswer(data.toString().trim());
        console.log(output);
    }
})