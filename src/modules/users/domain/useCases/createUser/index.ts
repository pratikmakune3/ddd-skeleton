import { InMemoryUserRepo } from "../../../infrastructure/inMemoryUserRepo";
import { CreateUser } from "./createUser";
import { CreateUserController } from "./createUserController";

const inMemoryUserRepo = new InMemoryUserRepo();

const createUser = new CreateUser(inMemoryUserRepo);

const createUserController = new CreateUserController(createUser);

export { createUserController };
