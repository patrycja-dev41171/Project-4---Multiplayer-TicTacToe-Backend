import { Router } from "express";

export const appRouter = Router();

appRouter

  .get("/", async (req, res) => {
    const message = 'Połaczenie poprawne'
    res.json({
      message: message,
    });
  })

 
