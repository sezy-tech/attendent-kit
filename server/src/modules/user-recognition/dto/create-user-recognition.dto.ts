import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class AddUserFaceDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsArray({ each: true })
    landmark: number[][]
}
