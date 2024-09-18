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
import { SearchArticleDTO } from '../dto/search-article.dto';
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

  // Get all articles
  @Get('/')
  async findAllArticles() {
    try {
      return this.ArticleService.findAllArticles();
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
  async findArticlesBySearchQuery(@Query() query: SearchArticleDTO) {
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
