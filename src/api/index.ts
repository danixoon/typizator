import * as express from "express";
import * as chalk from "chalk";
import { router as testRouter } from "./test";
import { logger } from "../logger";
import { errors } from "../error";
import * as util from "util";

export const router = express.Router();

const requestHandler: express.RequestHandler = (req, res, next) => {
  const { randomId } = req.query;

  const isDevelopment = process.env.NODE_ENV === "development";

  res.sendData = (data) => res.send({ data, randomId: randomId || null });
  res.sendItems = (items) => res.send({ items, randomId: randomId || null });
  res.sendError = (error) => {
    const code = error.code || 500;
    res.status(code).send({
      error: {
        message: error.message,
        stack: isDevelopment ? error.stack : undefined,
        name: error.name,
      },
    });
    logger.error(`API ошибка\n${util.inspect(error, false, 10, false)}`);
  };

  logger.info(`API метод ${req.url}`);

  next();
};

const notFoundHandler: express.RequestHandler = (req, res, next) => {
  logger.info(`API метод не найден ${req.url}`);
  res.sendError(errors.notFound("Метод не найден", "method.not_found"));
};

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).sendError(err);
};

router.use(requestHandler);
router.use("/test", testRouter);
router.use(notFoundHandler);
router.use(errorHandler);
