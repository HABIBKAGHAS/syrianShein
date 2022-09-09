import CurrencyExchangeController from "./Models/CurrencyExchange/CurrencyExchangeController";
import OrdersController from "./Models/Order/OrdersController";
import CitiesController from "./Models/Cities/CitiesController";
import UserController from "./Models/User/UserController";
import App from "./app";

const app = new App(
  [
    new CurrencyExchangeController(),
    new OrdersController(),
    new CitiesController(),
    new UserController(),
  ],
  80
);

app.listen();
