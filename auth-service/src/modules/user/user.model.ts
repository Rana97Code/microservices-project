import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class User {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: 'user' })
  role: string;
}