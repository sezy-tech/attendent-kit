import { PartialType } from '@nestjs/swagger';
import { CreateUserAttendentDto } from './create-user-attendent.dto';

export class UpdateUserAttendentDto extends PartialType(CreateUserAttendentDto) {}
