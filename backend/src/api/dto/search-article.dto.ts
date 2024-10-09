import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../enums/articles.status';
import { ArticleEvidence } from '../enums/article.evidence';

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

  @IsOptional()
  @IsInt()
  volume: number;

  @IsOptional()
  @IsInt()
  number: number;

  @IsOptional()
  @IsString()
  pages: string;

  @IsOptional()
  @IsString()
  doi: string;

  @IsOptional()
  @IsString()
  seMethod: string;

  @IsOptional()
  @IsEnum(ArticleEvidence)
  evidence: ArticleEvidence;

  @IsOptional()
  @IsString()
  claim: string;

  @IsOptional()
  @IsString()
  relevance: 'rating' | 'relevance';

  @IsOptional()
  @IsString()
  evidenceOrder: 'support' | 'against' | 'neutral';

  // @IsEnum(ArticleStatus)
  // status: ArticleStatus; // might change
}
