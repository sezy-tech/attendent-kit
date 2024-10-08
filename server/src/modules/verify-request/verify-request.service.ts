import { Injectable } from '@nestjs/common';
import { CreateVerifyRequestDto } from './dto/create-verify-request.dto';
import { UpdateVerifyRequestDto } from './dto/update-verify-request.dto';

@Injectable()
export class VerifyRequestService {
  create(createVerifyRequestDto: CreateVerifyRequestDto) {
    return 'This action adds a new verifyRequest';
  }

  findAll() {
    return `This action returns all verifyRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} verifyRequest`;
  }

  update(id: number, updateVerifyRequestDto: UpdateVerifyRequestDto) {
    return `This action updates a #${id} verifyRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} verifyRequest`;
  }
}
