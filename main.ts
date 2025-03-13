// Mistral AI Gateway

// import { gatewayApiKeyChecker } from './lib/middleware/gateway-api-key.mts';
import { Mistral } from "@mistralai/mistralai";

console.log("Starting Mistral AI Gateway...");

const
port          = 4321,
mistralApiKey = process.env['MISTRAL_API_KEY'] ?? ''; // '' must never happen

// console.log("api key", mistralApiKey);

const
mistral       = new Mistral({apiKey: mistralApiKey}),
model         = 'open-mistral-nemo-2407'; // https://docs.mistral.ai/getting-started/models/models_overview/#free-models

// console.log("Starting Mistral AI Gateway...", mistral);

const server = Bun.serve({
  port,
  fetch: async function(request: Request) {
    try {
      const userInput = await request.json();

      if (!(userInput && userInput.content && typeof userInput.content === 'string')) {
        throw new Error('unexpected request from user');
      }

      const 
      userContent = userInput.content,
      aiOutput = await mistral.chat.complete({
        model, stream: false,
        messages: [
          {
            content: userContent,
            role: "user",
          },
        ],
      });

      return new Response(
        JSON.stringify(aiOutput), 
        {
          status: 200, 
          statusText: 'OK',
          headers: {'Content-Type': 'application/json'}
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({message: `${error}`}),
        {
          status: 503, 
          statusText: 'Service Unavailable',
          headers: {'Content-Type': 'application/json'}
        }
      );
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
