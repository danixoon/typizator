import * as dotenv from "dotenv";
import * as express from "express";
import * as bodyParser from "body-parser";

import { logger } from "./logger";
import { router as apiRouter } from "./api";

dotenv.config();

const PORT = parseInt(process.env.PORT);

const app = express();

app.use(bodyParser.json());
app.use("/api", apiRouter);
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
});
