import { IsNotEmpty, IsNumber, IsArray, IsMongoId, isMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCourseDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    courseId: string;

    @IsNumber()
    @IsNotEmpty()
    day: number;

    @IsNumber()
    @IsNotEmpty()
    lessonFrom: number;

    @IsNumber()
    @IsNotEmpty()
    lessonTo: number;

    // @IsNumber()
    // @IsNotEmpty()
    // dayInWeek: number;

    // @IsMongoId()
    // @IsNotEmpty()
    // room: Types.ObjectId;

    // @IsMongoId({ each: true })
    // @IsOptional()
    // students: Types.ObjectId[];

    @IsOptional()
    studentIds: string[];
    // @IsMongoId({ each: true })
    // @IsOptional()
    // lecturers: Types.ObjectId[];
}