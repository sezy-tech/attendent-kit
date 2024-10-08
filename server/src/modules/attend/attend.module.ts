import { Module } from '@nestjs/common';
import { AttendService } from './attend.service';
import { AttendController } from './attend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAttendentModule } from '../user-attendent/user-attendent.module';
import { AttendSchema } from './attend.schema';
import { Attend } from './entities/attend.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attend.name, schema: AttendSchema }]),
  ],
  controllers: [AttendController],
  providers: [AttendService],
  exports: [AttendService],
})
export class AttendModule {}
