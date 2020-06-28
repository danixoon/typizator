import * as express from "express";
import { errors } from "../error";
import { logger } from "../logger";

export const router = express.Router();

router.get("/logger", (req, res, next) => {
  logger.debug("debug message");
  logger.info("info message");
  logger.error("error message");

  res.sendStatus(200);
});

router.get("/error/handled", (req, res, next) => {
  res.sendError(errors.accessDenied("Доступ запрещён", "test.access_denied"));
});

router.get("/error/unhandled", (req, res, next) => {
  throw new Error("Необработанная ошибка");
});
