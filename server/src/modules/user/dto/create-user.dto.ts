import { IsEmail, IsIn, IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    // You can customize the regex pattern based on your password policy
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    phone: string;
}
