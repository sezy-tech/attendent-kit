import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerifyRequestService } from './verify-request.service';
import { CreateVerifyRequestDto } from './dto/create-verify-request.dto';
import { UpdateVerifyRequestDto } from './dto/update-verify-request.dto';

@Controller('verify-request')
export class VerifyRequestController {
  constructor(private readonly verifyRequestService: VerifyRequestService) {}

  @Post()
  create(@Body() createVerifyRequestDto: CreateVerifyRequestDto) {
    return this.verifyRequestService.create(createVerifyRequestDto);
  }

  @Get()
  findAll() {
    return this.verifyRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.verifyRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVerifyRequestDto: UpdateVerifyRequestDto) {
    return this.verifyRequestService.update(+id, updateVerifyRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verifyRequestService.remove(+id);
  }
}
