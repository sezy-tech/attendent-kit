import { Test, TestingModule } from '@nestjs/testing';
import { VerifyRequestService } from './verify-request.service';

describe('VerifyRequestService', () => {
  let service: VerifyRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyRequestService],
    }).compile();

    service = module.get<VerifyRequestService>(VerifyRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
