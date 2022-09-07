import { IsNumber } from "class-validator";

class CreateOrderDetailsSheinDto {
  good_id: number;
  cat_id: number;
  goods_url_name: String;
  original_img: String;
  quantity: number;
  sku_sale_attr: String;
  order_id: number;
}

export default CreateOrderDetailsSheinDto;
