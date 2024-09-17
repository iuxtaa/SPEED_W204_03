import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../schemas/article.schema';
import { SearchArticleDTO } from '../dto/search-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}
  test(): string {
    return 'article route testing';
  }

  /*
    SEARCH FUNCTIONS
    for Researcher
  */

  // Finds all articles in the DB
  async findAllArticles(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }

  // Finds articles based on search query
  async findArticle(SearchArticleDTO: SearchArticleDTO): Promise<Article[]> {
    const query = this.buildSearchQuery(SearchArticleDTO);
    return await this.articleModel.find(query).exec();
  }

  // Creates a query object by iterating over each key in  SearchArticleDTO
  private buildSearchQuery(SearchArticleDTO: SearchArticleDTO): any {
    const query = {};

    Object.entries(SearchArticleDTO).forEach(([key, value]) => {
      if (value) {
        if (typeof value === 'string') {
          // Checks if the input value is a string
          query[key] = { $regex: value, $options: 'i' }; // Checks for partial matches in strings, regardless of casing
        } else {
          query[key] = value; // Exact match for non-string values
        }
      }
    });

    return query;
  }
}
