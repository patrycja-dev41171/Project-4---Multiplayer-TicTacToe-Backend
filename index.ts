import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import {handleError} from "./utils/handleErrors";

import { appRouter } from "./routers/app";

const app = express();

dotenv.config({ path: ".env" });

app.use(helmet());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/", appRouter);

app.use(handleError);

app.listen(8080, 'localhost', () => {
  console.log("Listening on http://localhost:8080");
});
