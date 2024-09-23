import { ArticleStatus } from '../enums/articles.status';

export class SubmitArticleDTO {
  title: string;
  author: string;
  journalName: string;
  publicationYear: number;
  volume?: number;  // Optional fields marked with ?
  number?: number;
  pages?: string;
  doi: string;
  articleStatus: ArticleStatus;
}