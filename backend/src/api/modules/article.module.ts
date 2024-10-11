import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from '../controller/article.controller';
import { ArticleService } from '../service/article.service';
import { Article, ArticleSchema } from '../schemas/article.schema';
import { EmailService } from '../service/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ConfigModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, EmailService],
  exports: [EmailService],
})
export class ArticleModule {}
