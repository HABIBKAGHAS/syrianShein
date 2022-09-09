import { IsNumber, IsString, Length } from "class-validator";

class UserRegisterDto {
  @IsString()
  @Length(1)
  email: string;
  @IsString()
  @Length(6)
  password: string;
  @IsString()
  name: string;
  @IsString()
  family: string;
  @IsString()
  @Length(1)
  mobile: string;
  @IsString()
  @Length(1)
  address_details: string;
  @IsNumber()
  city_id: number;
}

export default UserRegisterDto;
