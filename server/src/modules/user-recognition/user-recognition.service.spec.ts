import { Test, TestingModule } from '@nestjs/testing';
import { UserRecognitionService } from './user-recognition.service';

describe('UserRecognitionService', () => {
  let service: UserRecognitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRecognitionService],
    }).compile();

    service = module.get<UserRecognitionService>(UserRecognitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
