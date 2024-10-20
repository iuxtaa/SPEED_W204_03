import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../schemas/article.schema';
import { SubmitArticleDTO } from '../dto/submit-article.dto';
import { SearchAnalysedArticleDTO } from '../dto/search-article.dto';
import { ArticleStatus } from '../enums/articles.status';
import { ArticleRating } from '../enums/article.evidence';
import { UpdateArticleDTO } from '../dto/update-article.dto';
import { AnalyseArticleDTO } from '../dto/analyse-article.dto';
import { EmailService } from './email.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    private readonly emailService: EmailService, // Inject NotificationService
  ) {}
  test(): string {
    return 'article route testing';
  }

  /*
    SUBMIT FUNCTIONS
    for Submitter
  */
  async create(
    submitArticleDTO: SubmitArticleDTO,
    userEmail: string,
  ): Promise<Article> {
    const newArticle = new this.articleModel({
      articleStatus: ArticleStatus.Unmoderated, // Set default status to unmoderated
      email: userEmail,
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
    const submitterEmail = article.email;

    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (!submitterEmail) {
      throw new NotFoundException('Article submitter email not found');
    }

    article.articleStatus = ArticleStatus.Rejected; // Update article status to "rejected"
    article.feedback = feedback;
    await article.save();

    // Notify submitter of rejection
    await this.emailService.sendRejectionEmail(
      submitterEmail,
      article.title,
      article.feedback,
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
    await this.emailService.sendAcceptanceEmail(
      article.email,
      article.title,
    );

    // Notify the analyst that the article is ready for analysis
    await this.emailService.notifyAnalyst(article._id.toString(), article.title);

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

  /* Submit Rating 
  for Submitter and Researcher
  */
  async submitRating(id: string, rating: number) {
    const article = await this.articleModel.findById(id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (rating < ArticleRating.min || rating > ArticleRating.max) {
      throw new BadRequestException('Please enter a rating between 0 to 5');
    } else {
      // Update the rating count and sum
      article.ratingCount += 1;
      article.ratingSum += rating;

      // Calculate the new average rating
      article.rating = article.ratingSum / article.ratingCount;

      // Save the updated article
      await article.save();

      return { message: 'Article rating submitted', rating: article.rating };
    }
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

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.articleStatus = ArticleStatus.Analysed;
    await article.save();

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
    SearchAnalysedArticleDTO: SearchAnalysedArticleDTO,
  ): Promise<Article[]> {
    const query = this.buildSearchQuery(SearchAnalysedArticleDTO);
    const sortingOption = this.buildSortOption(SearchAnalysedArticleDTO);

    return await this.articleModel.find(query).sort(sortingOption).exec();
  }

  // Creates a query object by iterating over each key in  SearchArticleDTO
  private buildSearchQuery(
    SearchAnalysedArticleDTO: SearchAnalysedArticleDTO,
  ): any {
    const query = {
      articleStatus: ArticleStatus.Analysed,
    };

    Object.entries(SearchAnalysedArticleDTO).forEach(([key, value]) => {
      if (value && key !== 'sortBy') {
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

  // Used to retrieve articles based on the sort object that is built
  private buildSortOption(
    SearchAnalysedArticleDTO: SearchAnalysedArticleDTO,
  ): any {
    const { sortBy } = SearchAnalysedArticleDTO;
    const sort = {};

    if (sortBy === 'high rating') {
      sort['rating'] = -1;
    } else if (sortBy === 'low rating') {
      sort['rating'] = 1;
    }

    return sort;
  }
}

