import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../enums/articles.status';
import { ArticleEvidence } from '../enums/article.evidence';
export class UpdateArticleDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  journalName?: string;

  @IsOptional()
  @IsInt()
  publicationYear?: number;

  @IsOptional()
  @IsInt()
  volume?: number; // Optional fields marked with ?

  @IsOptional()
  @IsInt()
  number?: number;

  @IsOptional()
  @IsString()
  pages?: string;

  @IsOptional()
  @IsString()
  doi?: string;

  @IsEnum(ArticleStatus)
  articleStatus: ArticleStatus;

  @IsOptional()
  @IsEnum(ArticleEvidence)
  evidence?: ArticleEvidence;

  @IsOptional()
  @IsString()
  claim?: string;
}
