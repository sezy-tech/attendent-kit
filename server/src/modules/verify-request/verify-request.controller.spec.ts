import { Test, TestingModule } from '@nestjs/testing';
import { VerifyRequestController } from './verify-request.controller';
import { VerifyRequestService } from './verify-request.service';

describe('VerifyRequestController', () => {
  let controller: VerifyRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifyRequestController],
      providers: [VerifyRequestService],
    }).compile();

    controller = module.get<VerifyRequestController>(VerifyRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
