import * as express from "express";
import * as validate from "../middleware/validate";
import * as joi from "@hapi/joi";
import { errors } from "../error";
import { logger } from "../logger";

export const router = express.Router() as Api.IRouter<{
  get: Api.RequestRoute<
    "/info",
    { userId: number; message: string },
    { lol: boolean },
    { firstName: string; lastName: string; age: number }
  >;
}>;

router.get(
  "/info",
  validate.query({
    message: joi.string(),
    userId: joi.number(),
  }),
  validate.body({
    lol: joi.bool().optional(),
  }),
  (req, res) => {
    const { userId } = req.query;
    if (userId < 0)
      res.sendError(errors.notFound("Несуществующий пользователь", "user"));
    else res.sendData({ firstName: "ogo", lastName: "ogo", age: 10 });
  }
);
