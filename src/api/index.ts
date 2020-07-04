import * as express from "express";
import { router as userRouter } from "./user";
import { logger } from "../logger";
import { errors, createError } from "../error";
import * as util from "util";
import axios, { AxiosError, AxiosResponse } from "axios";

export const router = express.Router() as Api.IRouter;

const requestHandler: Api.RequestHandler = (req, res, next) => {
  const randomId = req.query.randomId as string;

  const isDevelopment = process.env.NODE_ENV === "development";

  res.sendData = (data) => {
    const response = { ...data, randomId: randomId };
    res.send(response);
  };

  res.sendError = (error) => {
    const { stack, message, name, code, ...rest } = error;
    const statusCode = code || 500;
    const response = {
      message: message,
      stack: isDevelopment ? stack : undefined,
      name: name,
      ...rest,
    };
    res.status(statusCode).send(response);
    logger.error(`API ошибка\n${util.inspect(error, false, 2, false)}`);
  };

  logger.info(`API метод ${req.url}`);
  next();
};

const notFoundHandler: express.RequestHandler = (req, res, next) => {
  logger.info(`API метод не найден ${req.url}`);
  res.sendError(errors.notFound("Метод не найден", "method"));
};

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  res.sendError(createError("internal", "error", 500, err));
};

router.use(requestHandler);
router.use("/user", userRouter as Api.IRouter);
router.use(notFoundHandler);
router.use(errorHandler);

type ApiRoutes = {
  user: typeof userRouter;
};

type getRouterSchema<R> = R extends Api.IRouter<infer S> ? S : never;

export const api: {
  [Router in keyof ApiRoutes]: {
    [Route in keyof getRouterSchema<ApiRoutes[Router]>]: getRouterSchema<
      ApiRoutes[Router]
    >[Route] extends Api.RequestRoute<infer U, infer Q, infer B, infer R>
      ? (url: U, query: Q, body: B) => Promise<AxiosResponse<R>>
      : never;
  };
  // get:
} = new Proxy({} as any, {
  get: (target, route) => {
    return new Proxy(
      {},
      {
        get: (target, method) => {
          return async (url: string, query: any = {}, body: any = {}) => {
            const fullUrl = `/${route.toString()}${url.toString()}`;
            // logger.debug(
            //   `API тестовый ${method
            //     .toString()
            //     .toUpperCase()} запрос ${fullUrl}`
            // );
            try {
              const response = await axios.request({
                method: method.toString() as any,
                params: query,
                data: body,
                url: `http://localhost:${process.env.PORT}/api${fullUrl}`,
                // validateStatus: () => true,
              });

              // logger.debug(
              //   `API тестовый ${method
              //     .toString()
              //     .toUpperCase()} ответ ${fullUrl}\n${util.inspect(
              //     response.data
              //   )}`
              // );
              return response;
            } catch (err) {
              throw err.response ?? err;
            }
          };
        },
      }
    );
  },
});
