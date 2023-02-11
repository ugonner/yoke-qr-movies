import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { IFullMovie, IPrismaMovieQueryObject, IPrismMovieCreate } from 'src/interfaces/movies';
import { Prisma } from '@prisma/client';
@Injectable()
export class MovieRepository {
    constructor(private readonly prismaService: PrismaService){}

    async createMovies(movies: IPrismMovieCreate){
        
        return await this.prismaService.movie.createMany(movies)
        
    }
    
    async findMovies(movieQueryObject: IPrismaMovieQueryObject){
        
        return await this.prismaService.movie.findMany(movieQueryObject);
        
    }
    
}
