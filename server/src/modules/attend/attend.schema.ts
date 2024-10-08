import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'attend' })
export class Attend {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  timeAttend: Number;
}

export type AttendDocumentType = Attend & Document;
export const AttendSchema = SchemaFactory.createForClass(Attend);