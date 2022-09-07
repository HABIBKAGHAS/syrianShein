import { IsNumber } from "class-validator";

class CreateCurrencyExchageDto {
  @IsNumber()
  price: number;
}

export default CreateCurrencyExchageDto;
