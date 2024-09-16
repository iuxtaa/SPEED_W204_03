import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  journalName: string;
  @Prop({ required: true })
  publicationYear: number;
  @Prop()
  volume: number;
  @Prop()
  number: number;
  @Prop()
  pages: string;
  @Prop({ required: true })
  doi: string;
}
export const ArticleSchema = SchemaFactory.createForClass(Article);
