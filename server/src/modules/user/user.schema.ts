import { OmitType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'user' })
class UserDocument {
  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop({  unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  tagId: string;

  @Prop({ required: true })
  password: string

  @Prop({ type: String })
  name: string

  @Prop({ type: String })
  phone: string

  @Prop({ type: String })
  labelNumber: string

  @Prop({ type: Number, default: 1 })
  role: number;

  @Prop({ type: String })
  deviceIds: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: Boolean })
  hasFaceInput: boolean;
}

export class User extends UserDocument {
  _id: Types.ObjectId;
}

export class SafeUser extends OmitType(User, ['password'] as const) {
}

const UserSchema = SchemaFactory.createForClass(UserDocument);
UserSchema.index({ studentId: 1, tagId: 1 })

export default UserSchema
