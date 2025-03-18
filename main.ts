// Mistral AI Gateway

// import { gatewayApiKeyChecker } from './lib/middleware/gateway-api-key.mts';
import { Mistral } from "@mistralai/mistralai";
import type { MiddlewareResult } from "./lib/middleware/middleware.mts";
import { MiddlewareHeaders } from "./lib/middleware/middleware.mts";
import cors from "./lib/middleware/cors.mts";

console.log("Starting Mistral AI Gateway...");

const
port          = 4321,
mistralApiKey = process.env['MISTRAL_API_KEY'] ?? ''; // '' must never happen

// console.log("api key", mistralApiKey);

const
mistral = new Mistral({apiKey: mistralApiKey}),

// models https://docs.mistral.ai/getting-started/models/models_overview/#free-models
model   = 'mistral-small-latest';
// model   = 'open-mistral-nemo-2407'; // nemo is bad at reasoning

// console.log("Starting Mistral AI Gateway...", mistral);

const server = Bun.serve({ // BUG implement CORS
  port,
  fetch: async function(request: Request) {
    console.debug("request", request);

    const 
    headers = new MiddlewareHeaders({'Content-Type': 'application/json'}),
    // middleware
    corsResult: MiddlewareResult = cors(request); 

    if (corsResult instanceof Response) {
      return corsResult;
    } else if (corsResult instanceof Headers) {
      headers.add(corsResult);
    }

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
      }),
      response = new Response(
        JSON.stringify(aiOutput), 
        {
          status: 200, 
          statusText: 'OK',
          headers
        }
      );

      console.debug("ok response", response);
      return response;
    } catch (error) {
      const response = new Response(
        JSON.stringify({message: `${error}`}),
        {
          status: 503, 
          statusText: 'Service Unavailable',
          headers
        }
      );
      console.debug("error response", response);
      return response;
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