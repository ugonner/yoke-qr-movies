import {Prisma} from '@prisma/client'

export interface IFullMovie {
    comingSoon?: boolean | string,
    title: string,
    year: string,
    rated: string,
    released: string,
    runtime: string,
    genre: string,
    director: string,
    writer: string,
    actors: string,
    plot: string,
    language: string,
    country: string,
    awards: string,
    poster: string,
    metascore: string,
    imdbRating: string,
    imdbVotes : string,
    imdbID: string,
    type: string,
    totalSeasons?: string,
    response: boolean | string,
    images: string[]
  }

  export interface IMovie{
    title: string;
    image: string;
  }

  export interface IPrismMovieCreate{
    data: Prisma.MovieCreateManyInput
  }
  export interface IPrismaMovieQueryObject{
    select: Prisma.MovieSelect,
    skip?: number,
    take?: number,
    where?: Prisma.MovieWhereInput
  }