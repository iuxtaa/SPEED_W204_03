import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../enums/articles.status';

export class SubmitArticleDTO {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  journalName: string;

  @IsInt()
  publicationYear: number;

  @IsOptional()
  @IsInt()
  volume?: number;  // Optional fields marked with ?

  @IsOptional()
  @IsInt()
  number?: number;

  @IsOptional()
  @IsString()
  pages?: string;

  @IsString()
  doi: string;

  // @IsString()
  // email: string;

  // @IsEnum(ArticleStatus)
  // articleStatus: ArticleStatus;
}