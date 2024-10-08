import { IsNotEmpty } from 'class-validator';

class AssignUserToCourseDto {
    @IsNotEmpty()
    userId: string;
}

export default AssignUserToCourseDto