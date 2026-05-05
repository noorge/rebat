import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  @IsNotEmpty()
  full_name: string

  @IsString()
  @IsNotEmpty()
  nationality: string

  @IsString()
  @IsNotEmpty()
  passport_number: string

  @IsString()
  company_name?: string
}
