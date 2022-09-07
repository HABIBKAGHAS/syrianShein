import NotFoundException from "../exceptions/NotFoundException";
import * as express from "express";

import "../utils/utils";
import { PrismaClient } from "@prisma/client";

class BaseController {
  protected prisma = new PrismaClient();
}

export default BaseController;
