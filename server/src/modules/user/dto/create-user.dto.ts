import { IsEmail, IsIn, IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty()
    studentId: string;

    @IsNotEmpty()
    tagId: string;

    @IsNotEmpty()
    name: string;

    // @IsNotEmpty()
    // @IsEmail()
    // email: string;

    // @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(32)
    // You can customize the regex pattern based on your password policy
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
    password: string = '123456';

    // @IsNotEmpty()
    // @IsString()
    // @MinLength(8)
    // phone: string;

    // @IsNotEmpty()
    @IsIn([1, 2, 3])
    role: number = 1;
}