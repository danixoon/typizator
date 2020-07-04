import * as express from "express";
import * as validate from "../middleware/validate";
import * as joi from "@hapi/joi";
import { errors } from "../error";
import { logger } from "../logger";

export const router = express.Router() as Api.IRouter<{
  get: Api.RequestRoute<
    "/info",
    { userId: string; message: string },
    { lol: boolean },
    Api.IResponseData<{ firstName: string; lastName: string; age: number }>
  >;
}>;

router.get(
  "/info",
  validate.query({
    message: joi.string(),
    userId: joi.string(),
  }),
  validate.body({
    lol: joi.bool(),
  }),
  (req, res) => {
    res.sendData({ firstName: "dane4ka", lastName: "owo", age: 10 });
  }
);
