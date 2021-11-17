import { Nothing } from "../../../shared/types";
import { User } from "../domain/entities/user";
import { IUserRepo } from "../data/repos/userRepo";

export class InMemoryUserRepo implements IUserRepo {
  constructor() {
    // Here's where I'd set up my InMemoryUser instance
  }

  async findByEmail(email: string): Promise<User | Nothing> {
    return "";
  }

  async save(user: User): Promise<any> {
    console.log("repo user-->", user);

    // And I'd save the user to InMemory in this method.
  }
}
