// export type Failure = {
//     status: string;      // Status of the response, typically "fail"
//     statusCode: number;  // HTTP status code (e.g., 400, 401, 403)
//     data: any;           // The data or error details associated with the failure
// };

export class Failure extends Error {
    status: string;
    statusCode: number;
    data: any;

    constructor(statusCode: number, message: string, data: any) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.name = 'Failure';  // Custom error name for easier debugging
        this.status = 'fail'
    }
}