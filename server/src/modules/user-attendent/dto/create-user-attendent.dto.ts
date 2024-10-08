import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserAttendentDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;
  @IsNotEmpty()
  @IsString()
  studentId: string;
  timeAttend: Date;

  constructor(timeAttend: Date) {
    timeAttend = new Date();
  }
}

export class RequestUserAttendantDto {
  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  tagIds: string[];
}

export class CheckUserAttendantDto {
  @IsNotEmpty()
  courseId: string;
}


export class CreateUserAttendantDto {
  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  studentId: string;
}
