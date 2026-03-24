import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Product {
  @prop({ required: true })
  title: string;

  @prop()
  description: string;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  userId: string; // owner
}