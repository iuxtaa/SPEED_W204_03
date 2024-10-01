import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from '../controller/article.controller';
import { ArticleService } from '../service/article.service';
import { Article, ArticleSchema } from '../schemas/article.schema';
import { NotificationService } from '../service/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, NotificationService],
})
export class ArticleModule {}
