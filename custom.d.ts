// import { Express, Send } from "express";

declare namespace Express {
  export interface Request {
    query: { [key: string]: any; randomId?: string };
  }
  export interface Response {
    sendItems(items: any[]): void;
    sendData(data: any): void;
    sendError(error: Error & { code?: number }): void;
  }
}
