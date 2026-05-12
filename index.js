import dotenv from 'dotenv'
import OpenAI from 'openai';

dotenv.config()

// const client = new OpenAI({
//     apiKey: process.env['OPENAI_API_KEY'] || OPENAI_API_KEY, // This is the default and can be omitted
// });

/**Simple AI response create with instructions*/

// const response = await client.responses.create({
//     model: 'gpt-5.5',
//     instructions: 'give result in point wise in short',
//     input: 'I am a node js developer, Give me the roadmap for becaming a nodejs backend developer to genAI developer with node',
// });

/**AI response create with roles*/

const response = await client.responses.create({
    model: 'gpt-5.5',
    input: [
        //system always on top
        {
            role: 'syatem', content: 'Answer in bengali'
        },
        {
            role: 'developer', content: 'give a basic js example'
        },
        {
            role: 'user', content: 'What is coding'
        }
    ]
});

// console.log(response.output_text);