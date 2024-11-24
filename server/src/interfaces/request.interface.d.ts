import { JwtPayload } from "jsonwebtoken";

// export interface Session {
//     user: string;
//     exp: number;
//     iat: number;
// }

declare global {
    namespace Express {
        interface Request {
            session?: JwtPayload; // Add your session property here
        }
    }
}

export { };