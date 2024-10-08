import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'device' })
class deviceDocument {
  @Prop({ required: true, unique: true })
  room: string;
}

export class Device extends deviceDocument {
  _id: Types.ObjectId;
}

const DeviceSchema = SchemaFactory.createForClass(deviceDocument);

export default DeviceSchema;
