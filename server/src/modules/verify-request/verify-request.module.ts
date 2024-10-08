import { Module } from '@nestjs/common';
import { VerifyRequestService } from './verify-request.service';
import { VerifyRequestController } from './verify-request.controller';

@Module({
  controllers: [VerifyRequestController],
  providers: [VerifyRequestService],
})
export class VerifyRequestModule {}
