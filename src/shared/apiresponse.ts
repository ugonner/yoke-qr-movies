import { IApiResponse } from "src/interfaces/apiresponse";

export class ApiResponse {
    static fail<TResourceType>(data: TResourceType, statusCode = 404, message: string){
        const response: IApiResponse<TResourceType> = {
            data,
            statusCode,
            message
        }
        return response;
    }
    static success<TResourceType>(data: TResourceType, statusCode = 200, message: string){
        const response: IApiResponse<TResourceType> = {
            data,
            statusCode,
            message
        };
        return response;
    }

    
}