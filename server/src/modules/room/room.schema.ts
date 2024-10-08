import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'room' })
class RoomDocument {
  @Prop({ required: true, unique: true })
  name: string;
}

export class Room extends RoomDocument {
  _id: Types.ObjectId;
}

const RoomSchema = SchemaFactory.createForClass(RoomDocument);

export default RoomSchema
