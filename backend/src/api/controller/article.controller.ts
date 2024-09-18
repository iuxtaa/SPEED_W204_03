import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from '../service/article.service';
import { SearchAnalysedArticleDTO } from '../dto/search-article.dto';
import { error } from 'console';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly ArticleService: ArticleService) {}

  @Get('/test')
  test() {
    return this.ArticleService.test();
  }

  /*
    GET FUNCTIONS
    for Articles
  */

  // Get analysed articles
  @Get('/analysed')
  async findAnalysedArticles() {
    try {
      return this.ArticleService.findAnalysededArticles();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles Found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Get unmoderated articles
  @Get('/unmoderated')
  async findUnmoderatedArticles() {
    try {
      return this.ArticleService.findUnmoderatedArticles();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles Found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Get unmoderated articles
  @Get('/moderated')
  async findModeratedArticles() {
    try {
      return this.ArticleService.findModeratedArticles();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles Found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Get rejected articles
  @Get('/rejected')
  async findRejectedArticles() {
    try {
      return this.ArticleService.findRejectedArticles();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles Found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Get articles by search query
  @Get('/search')
  async findArticlesBySearchQuery(@Query() query: SearchAnalysedArticleDTO) {
    try {
      return this.ArticleService.findArticle(query);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles Found for the given criteria',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
