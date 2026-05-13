import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware.js";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const log = req.log ?? logger;
  log.error(
    {
      err: {
        name: err?.name,
        message: err?.message,
        code: err?.code,
        stack: err?.stack,
      },
      method: req.method,
      url: req.url?.split("?")[0],
    },
    "Unhandled API error",
  );

  if (res.headersSent) return;

  const isProduction = process.env.NODE_ENV === "production";
  res.status(500).json({
    error: "Internal Server Error",
    ...(isProduction ? {} : { message: err?.message, stack: err?.stack }),
  });
};

app.use(errorHandler);

export default app;
