import * as express from "express";
import "express-async-errors";
import { appRouter } from "./routers/app";
import * as cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json()); // Content-type: application/json

app.use("/", appRouter);


app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on http://localhost:3001");
});
