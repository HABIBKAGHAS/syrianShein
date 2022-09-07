import * as express from "express";
import validationMiddleware from "../../middleware/validation.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import BaseController from "../BaseController";
import HttpException from "../../exceptions/HttpExceptions";
import NotFoundException from "../../exceptions/NotFoundException";
// import {  } from "../../Models";

class CitiesController extends BaseController {
  public get = "/Cities/:id";
  public read = "/Cities/";
  public delete = "/Cities/:id";
  public create = "/Cities/";
  public router = express.Router();

  constructor() {
    super();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.get, authMiddleware, async (req, res, next) => {});
    this.router.get(this.read, authMiddleware, this.getAll);
    // this.router.post(
    //   this.create,
    //   authMiddleware,
    //   validationMiddleware(CreateDto),
    //   this.createUpdate
    // );
    this.router.delete(this.delete, authMiddleware, this.deleteData);
  }

  getById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {};

  getAll = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const result = await this.prisma.cities.findMany();
    response.send(result);
  };

  createUpdate = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = request.body;
      const result = await this.prisma.cities.create({
        data: {
          ...dto,
        },
      });

      response.send(result);
    } catch (error) {
      console.log(error);
      next(new HttpException(0, error.meta.cause));
    }
  };

  deleteData = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const result = await this.prisma.cities.delete({
        where: {
          id: parseInt(request.params.id),
        },
      });

      response.send(result);
    } catch (error) {
      next(new NotFoundException(request.params.id, "Currency Exchange"));
    }
  };
}

export default CitiesController;
