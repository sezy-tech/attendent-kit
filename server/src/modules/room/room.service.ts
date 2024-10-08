import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './room.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) { }
  create(createRoomDto: CreateRoomDto) {
    return this.roomModel.create(createRoomDto)
  }

  findAll() {
    return this.roomModel.find()
  }

  findOne(id:string) {
    return this.roomModel.findById(id)
  }

  update(id:string, updateRoomDto: UpdateRoomDto) {
    return this.roomModel.findByIdAndUpdate(id, updateRoomDto)
  }

  remove(id:string) {
    return this.roomModel.findByIdAndDelete(id)
  }
}
