// import { Express, Send } from "express";

declare namespace Express {
  export interface Response {
    // sendData: Api.DataSender;
    // sendItems: Api.ItemsSender;
    sendError(error: Api.IResponseError["error"]): void;
  }
  export interface Request {
    query: Api.WithRandomId;
  }
}

declare namespace Api {
  export type WithRandomId = { randomId?: string };

  export interface IResponseItems<T = any> extends WithRandomId {
    items: T[];
    length: number;
    offset: number;
  }

  export interface IResponseData<T = any> extends WithRandomId {
    data: T;
  }

  export interface IResponseError extends WithRandomId {
    error: Error & { code?: number };
  }

  type ItemsSender<T> = (items: T[], count: number, offset: number) => any;

  type DataSender<T> = (data: T) => any;

  export type Response<T = IResponseItems> = import("express").Response &
    (T extends IResponseItems<infer I>
      ? { sendItems: ItemsSender<I> }
      : T extends IResponseData<infer I>
      ? { sendData: DataSender<I> }
      : { sendData: DataSender<T>; sendItems: ItemsSender<T> });

  export type Request<Q = {}, B = {}> = Omit<
    import("express").Request,
    "query" | "body"
  > & {
    query: Q & WithRandomId;
    body: B;
  };

  export type RequestHandler<Q = {}, B = {}, R = {}> = (
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
