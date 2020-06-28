import * as winston from "winston";
import * as chalk from "chalk";

const { combine, timestamp, label, printf, colorize } = winston.format;

const formatter = printf(({ level, message, label, timestamp }) => {
  const levelColors = {
    info: chalk.cyan,
    error: chalk.red,
    warn: chalk.yellow,
    debug: chalk.green,
  };

  const levelMsg = (
    levelColors[level as keyof typeof levelColors] ?? levelColors.info
  )(level.toUpperCase());

  const timestampMsg = chalk.gray(chalk.bold(timestamp));
  const extraSpaces = new Array(
    Math.abs(
      Object.keys(levelColors).sort((a, b) => (a.length < b.length ? 1 : -1))[0]
        .length - level.length
    )
  )
    .fill(" ")
    .join("");

  const infoMsg = `[${levelMsg}${extraSpaces} ${timestampMsg}]`;

  let msg = message.replace(/\d+/g, (match) => chalk.yellow(match));
  msg = msg.replace(/\/.+?(\s|$)/g, (match) => chalk.green(match));
  msg = msg.replace(/'.+?'/g, (match) => chalk.green(match));

  return `${infoMsg} ${msg}`;
});

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: () => new Date().toTimeString().split(" ")[0] }),
    formatter
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "development" ? "debug" : undefined,
    }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
