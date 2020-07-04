import * as dotenv from "dotenv";
import * as express from "express";
import * as bodyParser from "body-parser";

import { logger } from "./logger";
import { router as apiRouter, api } from "./api";

dotenv.config();

const PORT = parseInt(process.env.PORT);

const app = express();

app.use(bodyParser.json());
app.use("/api", apiRouter as express.IRouter);
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порте ${PORT}`);
  api.user.get("/info", { userId: "", message: "hewwo" });
});
