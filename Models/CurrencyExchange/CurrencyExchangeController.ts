import * as express from "express";
import CreateDto from "./CurrencyExchange.dto";
import validationMiddleware from "../../middleware/validation.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import BaseController from "../BaseController";
import HttpException from "../../exceptions/HttpExceptions";
import NotFoundException from "../../exceptions/NotFoundException";
// import {  } from "../../Models";

class CurrencyExchangeController extends BaseController {
  public get = "/CurrencyExchange/:id";
  public read = "/CurrencyExchange/";
  public delete = "/CurrencyExchange/:id";
  public create = "/CurrencyExchange/";
  public router = express.Router();

  constructor() {
    super();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.get, authMiddleware, async (req, res, next) => {});
    this.router.get(this.read, authMiddleware, this.getLatestExchangeRate);
    this.router.post(
      this.create,
      authMiddleware,
      validationMiddleware(CreateDto),
      this.createUpdate
    );
    this.router.delete(this.delete, authMiddleware, this.deleteData);
  }

  getById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {};

  getLatestExchangeRate = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const result = await this.prisma.currencyExchange.findMany();
    response.send(result);
  };

  createUpdate = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = request.body;
      const result = await this.prisma.currencyExchange.create({
        data: {
          price: dto.price,
          Posting_date: new Date(),
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
      const result = await this.prisma.currencyExchange.delete({
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

export default CurrencyExchangeController;
