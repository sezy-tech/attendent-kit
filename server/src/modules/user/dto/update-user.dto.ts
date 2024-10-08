import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateDeviceDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(100)
    @MaxLength(200)
    id: string
}