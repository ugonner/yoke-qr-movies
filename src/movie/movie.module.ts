import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieRepository } from './movie.repository';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, MovieRepository, PrismaService]
})
export class MovieModule {}
