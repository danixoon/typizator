import * as dotenv from "dotenv";
import * as express from "express";
import * as bodyParser from "body-parser";

import { logger } from "./logger";
import { router as apiRouter, api } from "./api";
import { AxiosError, AxiosResponse } from "axios";

dotenv.config();

const PORT = parseInt(process.env.PORT);

const app = express();

app.use(bodyParser.json());
app.use("/api", apiRouter as express.IRouter);
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порте ${PORT}`);
  api.user
    .get("/info", { userId: 123, message: "hewwo" }, { lol: true })
    .then((user) => {
      console.log(user.data);
    })
    .catch((err: AxiosResponse<Api.IResponseError>) => {
      logger.error(err.data);
    });
});
