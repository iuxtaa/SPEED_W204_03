import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../enums/articles.status';

export class SearchAnalysedArticleDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  journalName: string;

  @IsOptional()
  @IsInt()
  publicationYear: number;

  // @IsOptional()
  // @IsInt()
  // volume: number;

  // @IsOptional()
  // @IsInt()
  // number: number;

  // @IsOptional()
  // @IsString()
  // pages: string;

  @IsOptional()
  @IsString()
  doi: string;

  // @IsString()
  // seMethod: string;

  @IsEnum(ArticleStatus)
  articleStatus: ArticleStatus; // might change
}
