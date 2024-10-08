import { BadRequestException, HttpException, HttpStatus, Injectable,UploadedFile } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserRecognition } from './user-recognition.schema';
import { InjectModel } from '@nestjs/mongoose';
import { verifyFacePath, verifyLandmark } from './user-recognition.helper';
import { UserAttendentService } from '../user-attendent/user-attendent.service';
import { AttendService } from '../attend/attend.service';
import { CreateAttendDto } from '../attend/dto/create-attend.dto';
import { existsSync, mkdirSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import * as FormData from 'form-data';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class UserRecognitionService {
  httpService: any;
  private readonly PYTHON_API_URL = 'https://7b3f-123-20-129-137.ngrok-free.app/face/verify';
  constructor(

    
    @InjectModel(UserRecognition.name) private userRecognitionModel: Model<UserRecognition>,
    private attendService: AttendService,
   
  ) { }

  async findOneByUserId(userId: string) {
    return this.userRecognitionModel.findOne({ userId })
  }

  async addFaceLandMark(userId: string, landmark: number[][]): Promise<boolean> {
    if (!landmark.length) {
      throw new BadRequestException('Empty landmark');
    }
    const userRecognition = await this.userRecognitionModel.findOne({ userId })
    if (!userRecognition) {
      throw new BadRequestException('Error data')
    }

    userRecognition.landmarks.push(landmark)
    const canSaved = verifyLandmark(userRecognition.landmarks, landmark)

    if (canSaved) {
      await userRecognition.save();
    }

    return userRecognition.landmarks.length >= 10
  }
  async addFaces(userId: string, facePath: string): Promise<boolean> {
    if (!facePath) {
      throw new BadRequestException('Empty facePath');
    }
  
    const userRecognition = await this.userRecognitionModel.findOne({ userId });
  
    if (!userRecognition) {
      throw new BadRequestException('Error data');
    }
  
    // Ensure facePaths is initialized as an array
    if (!userRecognition.facePaths) {
      userRecognition.facePaths = [];
    }
  
    userRecognition.facePaths.push(facePath);
    await userRecognition.save();
  
    return true;
  }

  async saveFace(userId: string, file: Express.Multer.File): Promise<any> {
    // Define the upload path based on userId
    const uploadPath = join(__dirname, '..', 'faces', userId);
  
    // Debugging statements
    console.log('userId:', userId);
    console.log('file:', file);
    console.log('uploadPath:', uploadPath);
  
    // Ensure the directory exists
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
  
    // Generate a unique file name based on the current timestamp
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${timestamp}.${fileExtension}`;
  
    const filePath = join(uploadPath, uniqueFileName);
  
    console.log('filePath:', filePath);
  
    try {
      await fsPromises.writeFile(filePath, file.buffer);
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file');
    }
  }

  async createUserRecognition(userId: string): Promise<UserRecognition> {
    const userRecognition = new this.userRecognitionModel({
      userId,
      landmarks: [],
      speechPaths: [],
    });

    return userRecognition.save();
  }

  async verifyFace(userId: string, inputFacePath : string): Promise<boolean> {
    const userRecognition = await this.findOneByUserId(userId)
    const isValid = verifyFacePath(userRecognition.facePaths, inputFacePath)
    console.log(isValid,"isValid")  

    if (isValid) {
      const createAttendDto: CreateAttendDto = {
        courseId: "660e70425b646baf5aba6dbf",
        studentId: userId,
        timeAttend: Date.now(),
      };
      await this.attendService.create(userId, createAttendDto);
    }

    return isValid
  }
  
 
  
  


  async addSpeechPath(userId: string, path: string): Promise<boolean> {
    if (!path.length) {
      throw new BadRequestException('Empty path');
    }

    const userRecognition = await this.userRecognitionModel.findOne({ userId })

    if (!userRecognition) {
      throw new BadRequestException('Error data')
    }

    const isExistedSpeechPath = userRecognition.speechPaths.includes(path)
    if (isExistedSpeechPath) {
      return false
    }

    userRecognition.speechPaths.push(path)
    await userRecognition.save()
    return true
  }


  async verifySpeech(userId: string, path: string): Promise<boolean> {
    return true
  }
}
