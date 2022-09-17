import { Router } from "express";
import { HomeDataRecord } from "../records/homeData.record";
import { Scoreboard } from "../types";

export const homeDataRouter = Router();

homeDataRouter.get("/data/:user_id", async (req, res) => {
  const list = await HomeDataRecord.getAll();
  const user = list.find((x) => x.user_id === req.params.user_id);

  const numOfGames = await HomeDataRecord.getNumberOfGames(req.params.user_id);

  let sortedList: Scoreboard[] = [];

  for (const obj of list) {
    const found = sortedList.find((x) => x.username === obj.username);
    found === undefined
      ? sortedList.push({
          username: obj.username,
          points: obj.points,
        })
      : (found.points += obj.points);
  }

  sortedList.sort((a, b) => {
    return b.points - a.points;
  });

  let id = 0;
  const scoreboard = sortedList.map((x) => {
    id++;
    return {
      ...x,
      id: id,
    };
  });

  const place = scoreboard.find((x) => x.username === user.username);

  res.json({
    points: place.points,
    number_of_games: numOfGames,
    place: place.id,
    scoreboard: scoreboard,
  });
});
