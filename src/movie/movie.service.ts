import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { movies } from 'src/datasets/movies';
import { IApiResponse } from 'src/interfaces/apiresponse';
import { IMovie, IPrismaMovieQueryObject, IPrismMovieCreate } from 'src/interfaces/movies';
import { promisify } from 'util';
import * as qrCode from 'qrcode';
import { ApiResponse } from 'src/shared/apiresponse';
import { MovieRepository } from './movie.repository';
import {Prisma} from '@prisma/client'
@Injectable()
export class MovieService {
    constructor(@Inject(CACHE_MANAGER) private cacheService: Cache, private readonly movieRepository: MovieRepository){}
    private readonly domainServer = "https://yoke-qrm.onrender.com/movie";
    
    async createMovies(): Promise<IApiResponse<number | string>>{
        try{
            const moviesArray = {data: movies.map((movie) => { delete movie.images; return movie}) as Prisma.MovieCreateManyInput}
            const data: Prisma.BatchPayload = await this.movieRepository.createMovies(moviesArray)
            return ApiResponse.success<any>(data, 201, "movies created")
        }catch(err){
            return ApiResponse.fail<string>(err.message, 500, "something went wrong");
        }
    }



    async getMovies(randomMinLimit: number): Promise<IApiResponse<IMovie[] | string>>{
        try{
            const cachedMovies = await this.cacheService.get<IMovie[]>(process.env.MOVIES_CACHE_KEY);
            const cachedQRCode = await this.cacheService.get<boolean>(process.env.QRCODE_CACHE_KEY);
            //console.log(process.env.QRCODE_CACHE_KEY)
            if(cachedQRCode){
                if(cachedMovies) return ApiResponse.success<IMovie[]>(cachedMovies, 200, "movies still her");
                
                const randomizedArr: number[] = MovieService.generateRandomIndexArray(randomMinLimit, movies.length);
                const randomMovies = await this.fetchMoviesWithRandomArray(randomizedArr);
                await this.cacheService.set(process.env.MOVIES_CACHE_KEY, randomMovies, 10000);
                
                const d = await this.cacheService.get<IMovie[]>(process.env.MOVIES_CACHE_KEY);
                
                return ApiResponse.success<IMovie[]>(randomMovies, 200, "MOVIES GOT");
            }
            
            return ApiResponse.success<IMovie[]>([], 400, "orcode expired, rescan");
        }catch(err){
            return ApiResponse.fail<string>(err.message, 400, "orcode expired, rescan");
        }
    }

    
    async getQRCode(movieUrl: string): Promise<IApiResponse<string>> {
        const randomMovieLimit = Math.floor(Math.random() * 10);
        const url = movieUrl + "/"+randomMovieLimit;
        try{
            const cachedQRCode = await this.cacheService.get(process.env.QRCODE_CACHE_KEY);
            if(cachedQRCode){
                return ApiResponse.success<string>(cachedQRCode.toString(), 200, "QRCode generated successfully");
            }
            const promisifiedQRGenerator = promisify(qrCode.toDataURL);
            const dataUrl = await promisifiedQRGenerator(url);
            await this.cacheService.set(process.env.QRCODE_CACHE_KEY, dataUrl, 10000);
            
            return ApiResponse.success<string>(dataUrl.toString(), 200, "QRCode generated successfully"+url);
        }catch(err){
            return ApiResponse.fail<string>(err.message, 500, "an error occurred");        
        }
    }

    async fetchMoviesWithRandomArray(arrOfRandoms: number[]): Promise<IMovie[]>{
        try{
            const movieQueryObject: IPrismaMovieQueryObject = {
                select: {title: true, poster: true},
                where: {
                    id: {
                        in: arrOfRandoms
                    }
                },
                take: 10
            }
            const movies = await this.movieRepository.findMovies(movieQueryObject)
            
            return movies.map((movie) =>  ({title: movie.title, image: movie.poster}));
            
        }catch(e){
            //if there is error form database; then get random from local dataset
            console.log(e.message)
            return await arrOfRandoms.map((movieIndex) => {
                return {
                    title: movies[movieIndex].title,
                    image: movies[movieIndex].poster
                }
            })
        }
    }

    static generateRandomIndexArray(min: number, max: number): number[] {
        let arrOfRandoms: number[] = [];
        for(let i = 0; i < 10; i++){
            const random = Math.floor(Math.random() * (max - min)) + min;
            arrOfRandoms.push(random);
        }
        return arrOfRandoms;
    }
}
