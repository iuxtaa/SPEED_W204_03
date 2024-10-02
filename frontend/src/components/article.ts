// src/types/Article.ts

export type Article = {
    title?: string;
    authors?: string[];
    source?: string;
    publicationYear?: number;
    doi?: string;
    summary?: string;
  };
  
  export const DefaultEmptyArticle: Article = {
    title: '',
    authors: [''],
    source: '',
    publicationYear: undefined,
    doi: '',
    summary: '',
  };
  