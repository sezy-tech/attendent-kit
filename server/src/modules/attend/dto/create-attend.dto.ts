import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAttendDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;
  @IsNotEmpty()
  @IsString()
  studentId: string;
  

  @IsNotEmpty()
  @IsNumber()
  timeAttend: Number;

  constructor() {
    this.timeAttend = (Date.now()); // Convert milliseconds to seconds
  }

  // constructor(timeAttend: Date) {
  //   timeAttend = new Date();
  // }
}
