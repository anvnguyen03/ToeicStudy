export interface ApiResponse<T> {
    statusCode: number;
    message: any;
    data?: T;
    error: string;
}