import { Result } from "../../../../../shared/core/result";
import { UseCase } from "../../../../../shared/core/useCase";
import { Email } from "../../entities/email";
import { FirstName } from "../../entities/firstName";
import { LastName } from "../../entities/lastName";
import { Password } from "../../entities/password";
import { User } from "../../entities/user";
import { IUserRepo } from "../../../data/repos/userRepo";
import { CreateUserDto } from "./createUserDto";

// type CreateUserInput = {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
// };

type CreateUserSuccess = {
  type: "CreateUserSuccess";
};

type AlreadyRegisteredError = {
  type: "AlreadyRegisteredError";
};

type InvalidUserDetailsError = {
  type: "InvalidUserDetailsError";
  message: string;
};

type UnexpectedError = {
  type: "UnexpectedError";
};

export type CreateUserResult =
  | CreateUserSuccess
  | AlreadyRegisteredError
  | InvalidUserDetailsError
  | UnexpectedError;

export class CreateUser implements UseCase<CreateUserDto, CreateUserResult> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(input: CreateUserDto): Promise<CreateUserResult> {
    // Check to see if already registered
    const existingUser = await this.userRepo.findByEmail(input.email);

    // If already registered, return AlreadyRegisteredError
    if (existingUser) {
      return {
        type: "AlreadyRegisteredError",
      };
    }

    // Validation logic
    let emailOrError = Email.create(input.email);
    let firstNameOrError = FirstName.create(input.firstName);
    let lastNameOrError = LastName.create(input.lastName);
    let passwordOrError = Password.create(input.password);

    let combinedResult = Result.combine([
      emailOrError,
      firstNameOrError,
      lastNameOrError,
      passwordOrError,
    ]);

    if (combinedResult.isFailure) {
      return {
        type: "InvalidUserDetailsError",
        message: combinedResult.errorValue(),
      };
    }

    let userOrError = User.create({
      email: emailOrError.getValue() as Email,
      password: passwordOrError.getValue() as Password,
      firstName: firstNameOrError.getValue() as FirstName,
      lastName: lastNameOrError.getValue() as LastName,
    });

    if (userOrError.isFailure) {
      return {
        type: "InvalidUserDetailsError",
        message: userOrError.errorValue(),
      };
    }

    let user = userOrError.getValue() as User;

    // Save user to database
    try {
      await this.userRepo.save(user);
    } catch (err) {
      // Log this to monitoring or logging plugin but don't return
      // the backend error to the client.

      return {
        type: "UnexpectedError",
      };
    }

    return {
      type: "CreateUserSuccess",
    };
  }
}
