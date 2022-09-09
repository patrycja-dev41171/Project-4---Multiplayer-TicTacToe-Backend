import "express-async-errors";
import * as dotenv from 'dotenv';
import { appRouter } from "./routers/app";
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";

const app = express();

dotenv.config({ path: ".env" });

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

app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on http://localhost:3001");
});
