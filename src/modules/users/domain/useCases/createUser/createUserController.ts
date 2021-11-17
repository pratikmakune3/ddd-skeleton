import * as express from "express";
import { CreateUser } from "./createUser";
import { CreateUserDto } from "./createUserDto";

export class CreateUserController {
  private useCase: CreateUser;

  constructor(useCase: CreateUser) {
    this.useCase = useCase;
  }

  public async execute(req: express.Request, res: express.Response) {
    let dto: CreateUserDto = req.body;

    let body = req.body;

    // Check to see if firstname, lastname, password, email is in the request
    const isFirstNamePresent = body.firstName;
    const isLastNamePresent = body.lastName;
    const isEmailPresent = body.email;
    const isPasswordPresent = body.password;

    // If not, end the request
    if (
      !isFirstNamePresent ||
      !isEmailPresent ||
      !isLastNamePresent ||
      !isPasswordPresent
    ) {
      return res.status(400).json({
        message: `Either 'firstName', 'lastName', 'email' or 'password not present`,
      });
    }

    try {
      const result = await this.useCase.execute(dto);

      switch (result.type) {
        case "CreateUserSuccess":
          return res.status(201).json(result);
        case "AlreadyRegisteredError":
          return res.status(409).json(result);
        case "InvalidUserDetailsError":
          return res.status(400).json(result);
        case "UnexpectedError":
          return res.status(500).json(result);
      }
    } catch (err) {
      // Report the error to metrics + logging app

      return res.status(500);
    }
  }
}
