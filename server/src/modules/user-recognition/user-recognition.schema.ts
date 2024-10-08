import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'user-recognition' })
class UserRecognitionDocument {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, type: [[[Number]]] })
  landmarks: number[][][]

  @Prop({ required: true, type: [String] })
  speechPaths: string[]
  
  @Prop({ required: true, type: [String] })
  facePaths: string[]
}

export class UserRecognition extends UserRecognitionDocument {
  _id: Types.ObjectId;
}

const UserRecognitionSchema = SchemaFactory.createForClass(UserRecognitionDocument);

export default UserRecognitionSchema
