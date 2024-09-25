import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { SubmitArticleDTO } from '../dto/submit-article.dto';
import { SearchAnalysedArticleDTO } from '../dto/search-article.dto';
import { ArticleStatus } from '../enums/articles.status';
import { UpdateArticleDTO } from '../dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
  ) {}
  test(): string {
    return 'article route testing';
  }

  /*
    SUBMIT FUNCTIONS
    for Submitter
  */
  async create(submitArticleDTO: SubmitArticleDTO): Promise<Article> {
    const newArticle = new this.articleModel({
      articleStatus: ArticleStatus.Unmoderated, // Set default status to unmoderated
      ...submitArticleDTO,
    });

    return newArticle.save(); // Save returns the document with the auto-generated _id
  }

  // Adjust find, update, delete to use _id instead of id
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    return this.articleModel.findById(id).exec();  // Use _id
  }

  async update(id: string, updateArticleDto: UpdateArticleDTO): Promise<Article> {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();  // Use _id
  }

  async remove(id: string): Promise<Article> {
    return this.articleModel.findByIdAndDelete(id).exec();  // Use _id
  }

  /*
    SEARCH FUNCTIONS
    for Researcher
  */

  // Finds all accepted articles in the DB
  async findAnalysededArticles(): Promise<Article[]> {
    return await this.articleModel
      .find({ articleStatus: ArticleStatus.Analysed })
      .exec();
  }

  // Finds all unmoderated articles in the DB
  async findUnmoderatedArticles(): Promise<Article[]> {
    return this.articleModel
      .find({ articleStatus: ArticleStatus.Unmoderated })
      .exec();
  }

  // Finds all moderated articles in the DB
  async findModeratedArticles(): Promise<Article[]> {
    return await this.articleModel
      .find({ articleStatus: ArticleStatus.Moderated })
      .exec();
  }

  // Finds all rejected articles in the DB
  async findRejectedArticles(): Promise<Article[]> {
    return await this.articleModel
      .find({ articleStatus: ArticleStatus.Rejected })
      .exec();
  }

  // Finds articles based on search query
  async findArticle(
    SearchArticleDTO: SearchAnalysedArticleDTO,
  ): Promise<Article[]> {
    const query = this.buildSearchQuery(SearchArticleDTO);
    return await this.articleModel.find(query).exec();
  }

  // Creates a query object by iterating over each key in  SearchArticleDTO
  private buildSearchQuery(SearchArticleDTO: SearchAnalysedArticleDTO): any {
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
