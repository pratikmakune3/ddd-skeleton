import express from "express";
import bodyParser from "body-parser";
import { Server } from "http";

import { usersRouter } from "./modules/users/infrastructure/usersRouter";

const app = express();
app.use(bodyParser.json());
const port = 3000;

let server: Server;

app.use("/users", usersRouter);

function start() {
  server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

function stop() {
  server.close();
}

export { start, stop };
