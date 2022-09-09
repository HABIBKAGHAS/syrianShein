import * as express from "express";
import validationMiddleware from "../../middleware/validation.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import BaseController from "../BaseController";
import UserLoginDto from "./UserLogin.dto";
import UserRegisterDto from "./UserRegister.dto";
import WrongCredentialsException from "../../exceptions/WrongCredentialsException";
import TokenData from "Models/Token/TokenData";
import Payload from "Models/Token/Payload";
import { User } from "@prisma/client";
import HttpException from "../../exceptions/HttpExceptions";
import UserWithThatEmailAlreadyExistsException from "../../exceptions/UserWithThatEmailAlreadyExistsException";
// import {  } from "../../Models";
const jwt = require("jsonwebtoken");

class UserController extends BaseController {
  public loginRoute = "/login";
  public registerRoute = "/register";
  public router = express.Router();

  constructor() {
    super();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(
      this.loginRoute,
      authMiddleware,
      validationMiddleware(UserLoginDto),
      this.login
    );
    this.router.post(
      this.registerRoute,
      authMiddleware,
      validationMiddleware(UserRegisterDto),
      this.register
    );
  }

  login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const dto: UserLoginDto = request.body;
    const oldUser = await this.prisma.user.findUnique({
      where: {
        mobile: dto.mobile,
      },
    });

    console.log({ oldUser });

    if (oldUser && oldUser.password === dto.password) {
      const token = this.createToken(oldUser);

      response.send(token);
    } else {
      next(new WrongCredentialsException());
    }
  };

  register = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const dto: UserRegisterDto = request.body;
    try {
      const result = await this.prisma.user.create({
        data: {
          ...dto,
        },
      });

      const token = this.createToken(result);
      response.send(token);
    } catch (error) {
      console.log(error.meta);
      if (error.code === "P2002") {
        next(
          new UserWithThatEmailAlreadyExistsException(
            error.meta.target === "User_mobile_key" ? dto.mobile : dto.email
          )
        );
        return;
      } else if (error.code === "P2003") {
        next(
          new HttpException(
            422,
            error.meta.field_name === "city_id"
              ? "the city does not exist"
              : error
          )
        );
      }
      next(new HttpException(500, error));
    }
  };

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60 * 24; // an hour
    const secret = process.env.ACCESS_TOKEN_SECRET;
    console.log("user from token", user);
    const dataStoredInToken: Payload = {
      id: user.id.toString(),
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn: expiresIn }),
    };
  }
}

export default UserController;
