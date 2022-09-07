import HttpException from "./HttpExceptions";

class NotFoundException extends HttpException {
  constructor(id: string, docType: string = "") {
    super(404, `${docType} with id '${id}' not found`);
  }
}

export default NotFoundException;
