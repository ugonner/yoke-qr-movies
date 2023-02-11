import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/common/cache';
import redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { PrismaModule } from './database/prisma/prisma.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MovieModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      no_ready_check: true
    }),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
