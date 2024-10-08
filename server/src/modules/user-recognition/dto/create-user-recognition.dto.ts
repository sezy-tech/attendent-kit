import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class AddUserFaceDto {
    // @IsArray()
    // @ArrayNotEmpty()
    // @IsArray({ each: true })
    // landmark: number[][]
    @IsString()
    facePath : string
}

export class AddUserSpeechDto {
    @IsString()
    @IsNotEmpty()
    path: string
}

export class VerifyUserFaceDto extends AddUserFaceDto {
}

export class VerifyUserSpeechDto extends AddUserSpeechDto {
}
