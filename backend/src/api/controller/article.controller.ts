import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { error } from 'console';
import { ArticleService } from '../service/article.service';
import { SubmitArticleDTO } from '../dto/submit-article.dto';
import { SearchAnalysedArticleDTO } from '../dto/search-article.dto';
import { UpdateArticleDTO } from '../dto/update-article.dto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly ArticleService: ArticleService) {}

  @Get('/test')
  test() {
    return this.ArticleService.test();
  }

  /*
    POST, GET, PUT, DELETE FUNCTIONS
    for Articles
  */

  @Post()
  async create(@Body() submitArticleDTO: SubmitArticleDTO) {
    return this.ArticleService.create(submitArticleDTO);
  }

  @Get()
  async findAll() {
    return this.ArticleService.findAll();
  }

  @Get('/search-article-by-id/:id')
  async findOne(@Param('id') id: string) {
    return this.ArticleService.findOne(id); // Use _id from request parameter
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDTO) {
    return this.ArticleService.update(id, updateArticleDto);  // Use _id for update
  }

  @Delete('/search-article-by-id/:id')
  async remove(@Param('id') id: string) {
    return this.ArticleService.remove(id); // Use _id for deletion
  }

  /*
    GET FUNCTIONS
    for Articles
  */

  // Get analysed articles
  @Get('/analysed-articles')
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

  // ArticleController.ts
  @Get('/unmoderated-articles')
  async findUnmoderatedArticles() {
    try {
      return await this.ArticleService.findUnmoderatedArticles(); // Await here
    } catch (error) {
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


  // Get moderated articles
  @Get('/moderated-articles')
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
  @Get('/rejected-articles')
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
  @Get('/search-article')
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

