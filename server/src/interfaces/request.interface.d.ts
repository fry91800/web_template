import { JwtPayload } from "jsonwebtoken";


declare global {
    namespace Express {
        interface Request {
            session?: JwtPayload; // Add your session property here
        }
    }
}

export { };