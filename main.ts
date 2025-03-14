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


/*
aiOutput example:

{
    "id": "03b740b104dc44d08259643207dec853",
    "object": "chat.completion",
    "model": "open-mistral-nemo-2407",
    "usage": {
        "promptTokens": 12,
        "completionTokens": 100,
        "totalTokens": 112
    },
    "created": 1741796863,
    "choices": [
        {
            "index": 0,
            "message": {
                "content": "One of the most well-known Viennese desserts is \"Sachertorte\". It's a dense chocolate cake with a thin layer of apricot jam, covered in dark chocolate icing. The original recipe was created by Franz Sacher in 1832, and it's now a symbol of Austrian cuisine. Another famous Viennese dessert is \"Apfelstrudel\" (apple strudel), a layered pastry filled with apples, sugar, and cinnamon.",
                "toolCalls": null,
                "prefix": false,
                "role": "assistant"
            },
            "finishReason": "stop"
        }
    ]
}

*/