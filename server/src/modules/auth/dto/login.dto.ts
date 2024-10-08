import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    studentId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(32)
    password: string;
}