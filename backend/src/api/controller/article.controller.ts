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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { error } from 'console';
import { ArticleService } from '../service/article.service';
import { SubmitArticleDTO } from '../dto/submit-article.dto';
import { SearchAnalysedArticleDTO } from '../dto/search-article.dto';
import { UpdateArticleDTO } from '../dto/update-article.dto';
import { AnalyseArticleDTO } from '../dto/analyse-article.dto';
import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor to handle file uploads
import { diskStorage } from 'multer'; // Disk storage for saving files
import { extname } from 'path'; // Utility to extract the file extension
import * as fs from 'fs'; // For file system operations (reading the uploaded file)
import * as bibtexParse from 'bibtex-parse-js'; // BibTeX parser for parsing the uploaded .bib file
import { validate } from 'class-validator'; // For validating the DTO

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
  async create(
    @Body() submitArticleDTO: SubmitArticleDTO,
    @Body('email') email: string,
  ) {
    const userEmail = email;
    return this.ArticleService.create(submitArticleDTO, userEmail);
  }

  // Upload a bibtex file for article submission
  @Post('upload-bibtex')
  @UseInterceptors(FileInterceptor('bibtexFile', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const fileExt = extname(file.originalname);
        const fileName = `${Date.now()}-bibtex${fileExt}`;
        cb(null, fileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/x-bibtex' && file.mimetype !== 'text/plain') {
        return cb(new Error('Only BibTeX files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadBibtex(@UploadedFile() file: Express.Multer.File, @Body('email') email: string) {
    if (!file) {
      throw new BadRequestException('BibTeX file is required');
    }

    const bibtexContent = fs.readFileSync(file.path, 'utf8');
    const parsedBibtex = bibtexParse.toJSON(bibtexContent);

    if (!parsedBibtex || parsedBibtex.length === 0) {
      throw new BadRequestException('Invalid BibTeX format');
    }

    const bibtexEntry = parsedBibtex[0].entryTags;
    const articleData = new SubmitArticleDTO();

    articleData.title = bibtexEntry.title || '';
    articleData.author = bibtexEntry.author || '';
    articleData.journalName = bibtexEntry.journal || '';
    articleData.publicationYear = bibtexEntry.year ? parseInt(bibtexEntry.year) : 0;
    articleData.volume = bibtexEntry.volume ? parseInt(bibtexEntry.volume) : undefined;
    articleData.number = bibtexEntry.number ? parseInt(bibtexEntry.number) : undefined;
    articleData.pages = bibtexEntry.pages || '';
    articleData.doi = bibtexEntry.doi || '';

    const errors = await validate(articleData);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ' + JSON.stringify(errors));
    }

    // Call the create function from ArticleService, using email from the request body
    const userEmail = email; // Get email from @Body
    const savedArticle = await this.ArticleService.create(articleData, userEmail);

    return {
      message: 'BibTeX file uploaded and article saved successfully!',
      savedArticle,
    };
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
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDTO,
  ) {
    return this.ArticleService.update(id, updateArticleDto); // Use _id for update
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
    @Body() updateArticleDetailsDto: UpdateArticleDTO,
  ) {
    return this.ArticleService.updateArticleDetails(
      id,
      updateArticleDetailsDto,
    );
  }

  // For submitter and researcher to submit a rating for an article
  @Patch(':id/rating')
  async updateArticleRating(
    @Param('id') id: string,
    @Body('rating') rating: number,
  ) {
    return this.ArticleService.submitRating(id, rating);
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

  // Get all rejected articles submitted by a user
  @Get('/rejected-articles-by-user')
  async findRejectedArticlesByUser(@Body('email') email: string) {
    try {
      return this.ArticleService.findRejectedArticlesByUser(email);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No rejected articles found for this given user',
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

  /*
    PATCH FUNCTION
    for Articles
    for Analysers
  */

  // Analyser can ENTER evidence claim, result, and methodology
  @Patch('/analyse/:id')
  async analyseArticle(
    @Param('id') id: string,
    @Body() AnalyseArticleDTO: AnalyseArticleDTO,
  ) {
    return this.ArticleService.analyseArticle(id, AnalyseArticleDTO);
  }
}
