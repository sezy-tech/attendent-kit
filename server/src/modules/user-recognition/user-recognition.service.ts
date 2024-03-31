import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserRecognition } from './user-recognition.schema';
import { InjectModel } from '@nestjs/mongoose';
import { calculateEuclideanDistance } from './user-recognition.helper';

@Injectable()
export class UserRecognitionService {
  constructor(@InjectModel(UserRecognition.name) private userRecognitionModel: Model<UserRecognition>) { }

  async findOneByUserId(userId: string) {
    return this.userRecognitionModel.findOne({ userId })
  }

  async addFaceLandMark(userId: string, landmark: number[][]) {
    if (!landmark.length) {
      throw new BadRequestException('Empty landmark');
    }

    const userRecognition = await this.userRecognitionModel.findOne({ userId })

    if (!userRecognition) {
      throw new BadRequestException('Error data')
    }

    userRecognition.landmarks.push(landmark)
    return userRecognition.save();
  }

  async createUserRecognition(userId: string): Promise<UserRecognition> {
    const userRecognition = new this.userRecognitionModel({
      userId,
      landmarks: [],
      speechPaths: [],
    });

    return userRecognition.save();
  }

  async verifyFace(userId: string, inputLandmark: number[][]): Promise<boolean> {
    const userRecognition = await this.findOneByUserId(userId)
    for (const savedLandmark of userRecognition.landmarks) {
      const distance = calculateEuclideanDistance(inputLandmark, savedLandmark)
      if (distance < 2) {
        return true
      }
    }
    return false
  }
}
