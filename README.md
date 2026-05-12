# GenAI Node.js Project

This project demonstrates how to connect to the OpenAI API using Node.js.

> [!NOTE]  
> The method `client.responses.create()` present in the commented code in `index.js` is not a valid method in the official `openai` Node.js SDK. To generate responses with OpenAI models like GPT-4 or GPT-3.5, the correct method to use is `client.chat.completions.create()`.

## `client.chat.completions.create` Parameters

When making a request to OpenAI's Chat Completions API, you can pass several parameters to customize the behavior and output of the model. Here are the parameters you can use:

### Required Parameters

* **`model`** (string): The ID of the model to use (e.g., `"gpt-4o"`, `"gpt-3.5-turbo"`). 
* **`messages`** (array): A list of messages comprising the conversation so far. Each message object typically contains:
  * `role` (string): The role of the messages author. Can be `"system"` (for instructions), `"user"` (for user input), `"assistant"` (for model replies), or `"tool"`. 
  * `content` (string): The contents of the message.

### Optional Parameters

* **`reasoning_effort`** (string): Constrains effort on reasoning for models that support it (e.g., `o1`, `o3-mini`). Supported values are `"low"`, `"medium"`, and `"high"`. Reducing reasoning effort can speed up responses and use fewer tokens.
* **`temperature`** (number): Controls randomness. Values range from `0.0` to `2.0`. Higher values (e.g., `0.8`) make output more random, while lower values (e.g., `0.2`) make it more focused and deterministic.
* **`max_tokens`** (integer): The maximum number of tokens to generate in the completion. Useful to control costs and response length.
* **`top_p`** (number): An alternative to `temperature` (nucleus sampling). A value of `0.1` means only the tokens comprising the top 10% probability mass are considered. (It is generally recommended to alter this OR `temperature` but not both).
* **`frequency_penalty`** (number): Number between `-2.0` and `2.0`. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
* **`presence_penalty`** (number): Number between `-2.0` and `2.0`. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
* **`stop`** (string / array): Up to 4 sequences where the API will stop generating further tokens.
* **`stream`** (boolean): If `true`, the API will stream back partial progress via Server-Sent Events as the response is being generated.
* **`response_format`** (object): Specifies the format that the model must output (e.g., `{ "type": "json_object" }` to guarantee JSON output).
* **`seed`** (integer): If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result.
* **`n`** (integer): How many chat completion choices to generate for each input message. (Note: Because this can quickly increase your API costs, it's recommended to keep it at 1).
* **`store`** (boolean): If `true`, the chat completion will be stored for use in OpenAI's dashboard, allowing you to view and evaluate the interaction later.
* **`metadata`** (object): An optional JSON object of key-value pairs that you can attach to the completion. This is very helpful for categorizing and filtering logs in your dashboard when `store` is set to `true`.

## Understanding Token Usage

When you make a request to the OpenAI API, the cost and rate limits are calculated based on "tokens" (which are pieces of words). The API response includes a `usage` object that breaks down token consumption:

* **Input Tokens (`prompt_tokens`)**: The number of tokens in the messages you sent to the API. This includes the system instructions, user messages, and any previous assistant messages in the array.
* **Cached Tokens (`prompt_tokens_details.cached_tokens`)**: A subset of your input tokens that were previously processed and cached by OpenAI's servers (Prompt Caching). These are significantly cheaper and faster to process than standard input tokens.
* **Output Tokens (`completion_tokens`)**: The number of tokens the model generated in its final visible response. 
* **Reasoning Tokens (`completion_tokens_details.reasoning_tokens`)**: A subset of the output tokens generated specifically by reasoning models (like `o1` or `o3-mini`). These tokens represent the model's internal "thought process" before it produces the final output. They count towards your token limits and costs but are hidden from the final message content.
* **Total Tokens (`total_tokens`)**: The sum of all input tokens (including cached ones) and output tokens (including reasoning ones) used in the request. This determines the total volume of computation for the single API call.

## Correcting `index.js`

To achieve what the commented-out code in `index.js` was trying to do, here is the proper syntax using the OpenAI SDK:

```javascript
import OpenAI from 'openai';
import 'dotenv/config'; // A shorter way to load .env variables

const client = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY // This is the default behavior and can be omitted
});

async function main() {
    const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo', // The model you wish to use
        messages: [
            { 
                role: 'system', 
                content: 'You are a coding assistant that talks like a pirate' 
            },
            { 
                role: 'user', 
                content: 'I am a node js developer, Give me the roadmap for becaming a nodejs backend developer to genAI developer with node' 
            }
        ],
        temperature: 0.7,
        max_tokens: 500
    });

    // The output text is located inside the choices array
    console.log(response.choices[0].message.content);
}

main();
```
