import { Controller, Get, Req } from '@nestjs/common';
import { Param, Post } from '@nestjs/common/decorators';
import { Request } from 'express';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
    constructor(private movieService: MovieService){}

    @Get("/movies/:randomMinLimit")
    async getMovies(@Param("randomMinLimit") randomMinLimit: string){
        return await this.movieService.getMovies(Number(randomMinLimit));
    }
    
    @Get("/")
    async getQRCode(@Req() req: Request){
        const url = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
        console.log(url);
        return await this.movieService.getQRCode(url);
    }
    
    @Post("/create")
    async createMovies(){
        return await this.movieService.createMovies();
    }
}
