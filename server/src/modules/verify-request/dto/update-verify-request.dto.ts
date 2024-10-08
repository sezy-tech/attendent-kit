import { PartialType } from '@nestjs/swagger';
import { CreateVerifyRequestDto } from './create-verify-request.dto';

export class UpdateVerifyRequestDto extends PartialType(CreateVerifyRequestDto) {}
