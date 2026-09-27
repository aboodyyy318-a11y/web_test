import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true })
  available!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
