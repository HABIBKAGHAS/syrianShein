import { IsString, Length } from "class-validator";

class UserLoginDto {
  ID: number;
  @IsString()
  @Length(1)
  mobile: string;
  @IsString()
  @Length(6)
  password: string;
}

export default UserLoginDto;
