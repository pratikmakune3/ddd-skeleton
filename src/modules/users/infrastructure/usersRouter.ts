import express from "express";
import { createUserController } from "../domain/useCases/createUser";

const router = express.Router();

router.post("/", (req, res) => createUserController.execute(req, res));

export { router as usersRouter };
