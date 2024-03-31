import { Test, TestingModule } from '@nestjs/testing';
import { UserRecognitionController } from './user-recognition.controller';
import { UserRecognitionService } from './user-recognition.service';

describe('UserRecognitionController', () => {
  let controller: UserRecognitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRecognitionController],
      providers: [UserRecognitionService],
    }).compile();

    controller = module.get<UserRecognitionController>(UserRecognitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
