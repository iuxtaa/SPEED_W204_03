import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ArticleStatus } from '../enums/articles.status';
import { ArticleEvidence } from '../enums/article.evidence';

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

  @Prop()
  doi: string;

  @Prop({ required: true })
  articleStatus: ArticleStatus;

  @Prop()
  evidence: ArticleEvidence;

  @Prop()
  claim: string;

  @Prop()
  feedback: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  seMethod: string;

  @Prop({ type: Number, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  ratingSum: number;

  @Prop({ default: 0 })
  ratingCount: number;
}
export const ArticleSchema = SchemaFactory.createForClass(Article);
