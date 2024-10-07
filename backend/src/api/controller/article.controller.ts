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

  // submits articles and sends it to the database
  @Post()
  async create(@Body() submitArticleDTO: SubmitArticleDTO) {
    return this.ArticleService.create(submitArticleDTO);
  }

  // gets all articles from the database
  @Get()
  async findAll() {
    return this.ArticleService.findAll();
  }

  // find article by its ID
  @Get('/search-article-by-id/:id')
  async findOne(@Param('id') id: string) {
    return this.ArticleService.findOne(id); // Use _id from request parameter
  }

  // Updates article, needs ID of the article and a body
  // can be used by ANALYST to add claim and evidence
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDTO) {
    return this.ArticleService.update(id, updateArticleDto);  // Use _id for update
  }

  // Deletes an article by ID
  @Delete('/delete-article-by-id/:id')
  async remove(@Param('id') id: string) {
    return this.ArticleService.remove(id); // Use _id for deletion
  }

  // For admin to update article details, needs ID of the article and a body
  // can be used by ADMIN to edit ANY details
  @Put(':id/details')
  async updateArticleDetails(
    @Param('id') id: string,
    @Body() updateArticleDetailsDto: UpdateArticleDTO
  ) {
    return this.ArticleService.updateArticleDetails(id, updateArticleDetailsDto);
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

  // Gets all rejected articles
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

  /*
    PATCH FUNCTIONS
    for Articles
    for Moderators
  */

  // Moderator can REJECT the article 
  @Patch('/:id/reject')
    async rejectArticle(
      @Param('id') id: string,
      @Body('feedback') feedback: string,
    ) {
      return this.ArticleService.rejectArticle(id, feedback);
  }

  // Moderator can ACCEPT the article (which brings it to the analyst), the article becomes 'Moderated'
  @Patch('/:id/accept')
  async acceptArticle(@Param('id') id: string) {
    return this.ArticleService.acceptArticle(id);
  }
}
