import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from './device.schema';

@Injectable()
export class DeviceService {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>)
   {}
  create(createDeviceDto: CreateDeviceDto) {
    return this.deviceModel.create(createDeviceDto);
  }

  findAll() {
    return `This action returns all device`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
