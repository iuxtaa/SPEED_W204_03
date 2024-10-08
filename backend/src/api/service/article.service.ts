import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { SubmitArticleDTO } from '../dto/submit-article.dto';
import { SearchAnalysedArticleDTO } from '../dto/search-article.dto';
import { ArticleStatus } from '../enums/articles.status';
import { UpdateArticleDTO } from '../dto/update-article.dto';
import { NotificationService } from './notification.service'; // Import the NotificationService
import { AnalyseArticleDTO } from '../dto/analyse-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    private readonly notificationService: NotificationService, // Inject NotificationService
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
      email: submitArticleDTO.email,
      ...submitArticleDTO,
    });

    return newArticle.save(); // Save returns the document with the auto-generated _id
  }

  // Adjust find, update, delete to use _id instead of id
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    return this.articleModel.findById(id).exec(); // Use _id
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDTO,
  ): Promise<Article> {
    return this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec(); // Use _id
  }

  async remove(id: string): Promise<Article> {
    return this.articleModel.findByIdAndDelete(id).exec(); // Use _id
  }

  /*
    Accept and Reject Functions
    for Moderator
  */

  // Moderator can reject the article, setting the article status to 'Rejected'
  async rejectArticle(id: string, feedback: string) {
    const article = await this.articleModel.findById(id); // Fetch the article by ID

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.articleStatus = ArticleStatus.Rejected; // Update article status to "rejected"
    article.feedback = feedback;
    await article.save();

    // Notify submitter of rejection
    await this.notificationService.notifySubmitter(
      article.email,
      'Your article was rejected: ',
    );

    return { message: 'Article rejected and submitter notified' };
  }

  // Moderator can accept the article, setting the article status to 'Moderated'
  async acceptArticle(id: string) {
    // Fetch the article by ID
    const article = await this.articleModel.findById(id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Update article status to 'Moderated'
    article.articleStatus = ArticleStatus.Moderated;
    await article.save();

    // Notify the submitter of the acceptance
    await this.notificationService.notifySubmitter(
      article.email,
      'Your article has been accepted.',
    );

    // Notify the analyst that the article is ready for analysis
    await this.notificationService.notifyAnalyst(article._id.toString());

    return { message: 'Article accepted and submitter & analyst notified' };
  }

  /*
    Update article Functions
    for Administrator
  */
  async updateArticleDetails(
    id: string,
    updateArticleDetailsDto: UpdateArticleDTO,
  ): Promise<Article> {
    const article = await this.articleModel.findById(id);
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Update the article details if provided
    article.title = updateArticleDetailsDto.title ?? article.title;
    article.author = updateArticleDetailsDto.author ?? article.author;
    article.journalName =
      updateArticleDetailsDto.journalName ?? article.journalName;
    article.publicationYear =
      updateArticleDetailsDto.publicationYear ?? article.publicationYear;
    article.volume = updateArticleDetailsDto.volume ?? article.volume;
    article.number = updateArticleDetailsDto.number ?? article.number;
    article.pages = updateArticleDetailsDto.pages ?? article.pages;
    article.doi = updateArticleDetailsDto.doi ?? article.doi;
    article.articleStatus =
      updateArticleDetailsDto.articleStatus ?? article.articleStatus;
    article.evidence = updateArticleDetailsDto.evidence ?? article.evidence;
    article.claim = updateArticleDetailsDto.claim ?? article.claim;

    return article.save();
  }

  /* 
    Update Function
    for Analyser
  */
  async analyseArticle(
    id: string,
    AnalyseArticleDTO: AnalyseArticleDTO,
  ): Promise<Article> {
    const article = await this.articleModel.findById(id);

    article.articleStatus = ArticleStatus.Analysed;
    article.save();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.articleModel
      .findByIdAndUpdate(id, AnalyseArticleDTO, { new: true })
      .exec();
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

  // Finds all rejected articles from a user
  async findRejectedArticlesByUser(email: string): Promise<Article[]> {
    return await this.articleModel
      .find({ articleStatus: ArticleStatus.Rejected, email })
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
