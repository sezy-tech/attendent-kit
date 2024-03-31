import { OmitType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'user' })
class UserDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  phone: string

  @Prop({ type: Number, default: 1 })
  role: number;
}

export class User extends UserDocument {
  _id: Types.ObjectId;
}

export class SafeUser extends OmitType(User, ['password'] as const) {
}

const UserSchema = SchemaFactory.createForClass(UserDocument);

export default UserSchema
