
type MiddlewareResult = Headers | Response | null | undefined ;
type Middleware       = (request: Request) => MiddlewareResult ;
type MiddlewareAsync  = (request: Request) => Promise<MiddlewareResult> ;

class MiddlewareHeaders extends Headers {
  constructor(init?: HeadersInit) {
    super(init);
  }
  add(source: Headers) {
    source.forEach((value, key) => this.append(key, value));
  }
}

export { MiddlewareHeaders };
export type { MiddlewareAsync, Middleware, MiddlewareResult };
