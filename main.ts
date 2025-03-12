// Mistral AI Gateway


// import { gatewayApiKeyChecker } from './lib/middleware/gateway-api-key.mts';

import { Mistral } from "@mistralai/mistralai";

console.log("Starting Mistral AI Gateway...");

type MistralReply = {

}

const
port          = 4321,
mistralApiKey = process.env['MISTRAL_API_KEY'] ?? ''; // '' must never happen

// console.log("api key", mistralApiKey);

const
mistral       = new Mistral({apiKey: mistralApiKey}),
model         = 'open-mistral-nemo-2407'; // https://docs.mistral.ai/getting-started/models/models_overview/#free-models

// console.log("init'd Mistral AI Gateway...", mistral);

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

// router = new Router()
// .get("/", (ctx: Context) => {
//   ctx.response.body = 
//   `<!DOCTYPE html>
//     <html>
//       <head><title>Mistral AI Gateway</title><head>
//       <body>
//         <h1>Mistral AI Gateway</h1>
//         <p>Current time: ${new Date()}</p>
//       </body>
//     </html>`;
// })
// .get("/chat", async (ctx: Context) => {
//   const
//   userInput = "Name a well-known Austrian dessert.",
//   aiOutput = await mistral.chat.complete({
//     model,
//     stream: false,
//     messages: [
//       {
//         content: userInput,
//         role: "user",
//       },
//     ],
//   });
//   // console.log(aiOutput);
//   ctx.response.body = 
//   `<!DOCTYPE html>
//     <html>
//       <head><title>Mistral AI Gateway</title><head>
//       <body>
//         <h1>Mistral AI Gateway</h1>
//         <p>👨 User inquiry: ${userInput}</p>
//         <p>🤖 AI response: ${JSON.stringify(aiOutput)}</p>
//         <p>Current time: ${new Date()}</p>
//       </body>
//     </html>`;
// });

// new Application()
// // .use(gatewayApiKeyChecker)
// .use(router.routes())
// .use(router.allowedMethods())
// .listen({ port });
