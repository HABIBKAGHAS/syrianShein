import { IsNumber } from "class-validator";
import CreateOrderDetailsSheinDto from "./OrderDetailsShein.dto";

class CreateCurrencyExchageDto {
  posting_date: Date;
  server_response: string;
  user_id: number;
  market_id: number;
  details: Array<CreateOrderDetailsSheinDto>;
}

export default CreateCurrencyExchageDto;
