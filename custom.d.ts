// import { Express, Send } from "express";

declare namespace Express {
  export interface Response {
    // sendData: Api.DataSender;
    // sendItems: Api.ItemsSender;
    sendError(error: Api.IResponseError): void;
  }
  export interface Request {
    query: Api.WithRandomId;
  }
}

declare namespace Api {
  export type WithRandomId = { randomId?: string };

  export type IResponseItems<T = {}> = WithRandomId & {
    items: T[];
    length: number;
    offset: number;
  };

  export type IResponseData<T = {}> = WithRandomId & T;
  export type IResponseError = Error & { code?: number };

  // type ItemsSender<T> = (items: T[], count: number, offset: number) => any;

  // type DataSender<T> = (data: T) => any;

  export type Response<T = any> = import("express").Response & {
    sendData: (
      data: T extends Array<infer I> ? IResponseItems<I> : IResponseData<T>
    ) => void;
  };

  export type Request<Q = any, B = any> = Omit<
    import("express").Request,
    "query" | "body"
  > & {
    query: Q & WithRandomId;
    body: B;
  };

  export type RequestHandler<Q = any, B = any, R = any> = (
    req: Request<Q, B>,
    res: Response<R>,
    next: (err?: any) => void
  ) => any;

  export type RequestRoute<U = string, Q = any, B = any, R = any> = (
    url: U,
    ...handlers: RequestHandler<Q, B, R>[]
  ) => any;

  export type IRouter<S = {}> = {
    use: import("express").IRouter["use"] &
      ((path: string, router: IRouter) => any);
  } & S &
    Omit<import("express").IRouter, keyof S>;
}
