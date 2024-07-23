import { IsEmail, MinLength, Equals, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsStrongPassword()
    password: string;
}