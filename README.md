<p align="left">
<a href="https://mistral.ai/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/doga/doga/refs/heads/main/logos/Mistral_AI_logo_(2025%E2%80%93).svg" height="85" alt="Mistral logo" /></a>
</p>

# An HTTP(S) gateway for Mistral.ai's web API

The primary purpose of this gateway is to hide the Mistral API key from client software. This application is currently using [one of the free Mistral models](https://docs.mistral.ai/getting-started/models/models_overview/#free-models).

This is a TypeScript application that runs on the Bun runtime.
This is a Bun application and not a Deno application because it seems that Deno-compatibility is currently not a priority for Mistral.

## How to run

Prerequisites:

- Install the [Bun](https://bun.sh) runtime.
- This application requires an [API key from Mistral](https://console.mistral.ai/api-keys).

Once you've got that done, run the gateway thusly:

```shell
MISTRAL_API_KEY='<AnApiKey>' bun run dev
```

Right now the gateway only supports HTTP (not HTTPS), and the TCP port number is fixed to `4321`.

## JavaScript client

See [mistral-ai-gateway-client](https://github.com/doga/mistral-ai-gateway-client).

## Dependencies

This library depends on the [official Mistral Typescript Client](https://github.com/mistralai/client-ts).

∎
