import type { Middleware } from "./middleware.mts";
import { MiddlewareHeaders } from "./middleware.mts";

// CORS options
const 
allowedMethods = ['POST', 'PUT', 'DELETE', 'GET', 'OPTIONS'],
allowedHeaders = ['Content-Type', 'Authorization'],

cors: Middleware = (request) => {
  /**
   * CORS option: Origin-based access restriction.
   * Value is space-separated origin URLs. 
   * @example 'chrome-extension://dhbdokkcnkaokiohblcmkhlllbbmedgn https://site.example'
   **/
  const
  allowedOriginsEnv = process.env['CORS_ALLOWED_ORIGINS'],
  headers           = new MiddlewareHeaders();

  if (allowedOriginsEnv) {
    const
    allowedOrigins = allowedOriginsEnv.replaceAll(/\s+/g, ' ').split(' ').filter(s => s.length > 0),
    origin         = request.headers.get('Origin');

    if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
    } else {
      const status = 403, body = { message: `Forbidden request origin: ${origin}` };
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify(body), { status, headers });
    }
  } else {
    headers.set('Access-Control-Allow-Origin', '*');
  }

  headers.set('Access-Control-Allow-Methods', allowedMethods.join(", "));
  headers.set('Access-Control-Allow-Headers', allowedHeaders.join(", "));
  headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  // Preflight request handling (optional)
  if (request.method === 'OPTIONS') {
    console.debug('Preflight request', request);
    const 
    status = 204, // No Content 
    body = null,
    response = new Response(body, { status, headers });

    console.debug('Preflight response', response);
    return response;
  }

  return headers;
};

export default cors;
export { cors };
