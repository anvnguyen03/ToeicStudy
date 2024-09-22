export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        fullName: string;
        address: string;
        role: {
            id?: string;
            name?: string;
            permissions?: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    }
}