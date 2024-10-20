import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from '../service/article.service';
import { SubmitArticleDTO } from '../dto/submit-article.dto';
import { UpdateArticleDTO } from '../dto/update-article.dto';
import { SearchAnalysedArticleDTO } from '../dto/search-article.dto';

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: ArticleService;

  const mockArticleService = {
    test: jest.fn(() => 'article route testing'),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    rejectArticle: jest.fn(),
    acceptArticle: jest.fn(),
    updateArticleDetails: jest.fn(),
    findAnalysededArticles: jest.fn(),
    findUnmoderatedArticles: jest.fn(),
    findModeratedArticles: jest.fn(),
    findRejectedArticles: jest.fn(),
    findArticle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test route', () => {
    it('should return test message', async () => {
      const result = 'article route testing';
      expect(await controller.test()).toEqual(result);
    });
  });

  describe('create', () => {
    it('should call service to create an article', async () => {
      const dto: SubmitArticleDTO = {
        title: 'Test Article',
        author: 'Author Name',
        journalName: 'Test Journal',
        publicationYear: 2023,
        doi: '123',
        // email: '123@gmail.com'
      };

      const email = '123@gmail.com';
      await controller.create(dto, email);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const result = [{ title: 'Test Article', author: 'Author' }];
      mockArticleService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should call service to find an article by ID', async () => {
      const articleId = 'some-article-id';
      await controller.findOne(articleId);
      expect(service.findOne).toHaveBeenCalledWith(articleId);
    });
  });

  describe('update', () => {
    it('should call service to update an article', async () => {
      const articleId = 'some-article-id';
      const updateDTO: UpdateArticleDTO = { title: 'Updated Title' };

      await controller.update(articleId, updateDTO);
      expect(service.update).toHaveBeenCalledWith(articleId, updateDTO);
    });
  });

  describe('remove', () => {
    it('should call service to delete an article by ID', async () => {
      const articleId = 'some-article-id';

      await controller.remove(articleId);
      expect(service.remove).toHaveBeenCalledWith(articleId);
    });
  });

  describe('rejectArticle', () => {
    it('should call service to reject an article with feedback', async () => {
      const articleId = 'some-article-id';
      const feedback = 'Invalid data';

      await controller.rejectArticle(articleId, feedback);
      expect(service.rejectArticle).toHaveBeenCalledWith(articleId, feedback);
    });
  });

  describe('acceptArticle', () => {
    it('should call service to accept an article', async () => {
      const articleId = 'some-article-id';

      await controller.acceptArticle(articleId);
      expect(service.acceptArticle).toHaveBeenCalledWith(articleId);
    });
  });
});
