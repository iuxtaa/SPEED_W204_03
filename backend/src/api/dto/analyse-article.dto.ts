import { IsEnum, IsString } from 'class-validator';
import { ArticleStatus } from '../enums/articles.status';
import { ArticleEvidence } from '../enums/article.evidence';

export class AnalyseArticleDTO {
  @IsString()
  seMethod: string;

  @IsString()
  claim: string;

  @IsEnum(ArticleEvidence)
  evidence: ArticleEvidence;

  @IsEnum(ArticleStatus)
  articleStatus: ArticleStatus.Analysed;
}
