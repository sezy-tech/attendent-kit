import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'verify-request' })
class VerifyRequestDocument {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, type: [[[Number]]] })
  landmarks: number[][][]

  @Prop({ required: true, type: [String] })
  speechPaths: string[]
}

export class VerifyRequest extends VerifyRequestDocument {
  _id: Types.ObjectId;
}

const VerifyRequestSchema = SchemaFactory.createForClass(VerifyRequestDocument);

export default VerifyRequestSchema
