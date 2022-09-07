import * as express from "express";
import CreateDto from "./Orders.dto";
import validationMiddleware from "../../middleware/validation.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import BaseController from "../BaseController";
import HttpException from "../../exceptions/HttpExceptions";
import NotFoundException from "../../exceptions/NotFoundException";
import axios from "axios";
// import {  } from "../../Models";

class OrdersController extends BaseController {
  public get = "/orders/:id";
  public read = "/orders/";
  public delete = "/orders/:id";
  public create = "/orders/";
  public cart = "/cart/";
  public router = express.Router();

  constructor() {
    super();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.get, authMiddleware, async (req, res, next) => {});
    this.router.get(this.read, authMiddleware, this.getAllOrders);
    this.router.post(this.cart, authMiddleware, this.getCart);
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

  getAllOrders = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const result = await this.prisma.orders.findMany({
      include: {
        OrderDetails: true,
      },
    });
    response.send(JSON.parse(this.toJson(result)));
  };

  getCart = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const result = await axios.get(
      "https://m.shein.com/roe/cart/checkcart?_ver=1.1.8&_lang=en",
      {
        headers: {
          Cookie: `${request.body.cookiesForWebsite}`,
        },
      }
    );
    response.send(result.data);
  };

  createUpdate = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const dto = request.body;

    const order = { ...dto };
    delete order.details;
    try {
      const result = await this.prisma.orders.create({
        data: {
          ...order,
          posting_date: new Date(),
          server_response: "",
          status: "new",
        },
      });
      const unresolved = dto.details.map(async (x) => {
        const innerResult = await this.prisma.orderDetailsShein.create({
          data: { ...x, order_id: result.id },
        });
      });

      await Promise.all(unresolved);
      response.send(result);
    } catch (error) {
      console.log(error);
      next(new HttpException(0, error));
    }
  };

  deleteData = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const result = await this.prisma.orders.delete({
        where: {
          id: parseInt(request.params.id),
        },
      });

      response.send(result);
    } catch (error) {
      next(new NotFoundException(request.params.id, "Order"));
    }
  };

  toJson = (data) => {
    return JSON.stringify(data, (_, v) =>
      typeof v === "bigint" ? `${v}n` : v
    ).replace(/"(-?\d+)n"/g, (_, a) => a);
  };
}

export default OrdersController;
