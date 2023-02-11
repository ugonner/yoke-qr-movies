export interface IApiResponse<TResourceType>{
    statusCode: number;
    message: string;
    data: TResourceType
}
