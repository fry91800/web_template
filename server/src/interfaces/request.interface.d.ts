import { JwtPayload } from "jsonwebtoken";
import { i18n } from 'i18next';


declare global {
    namespace Express {
        interface Request {
            session?: JwtPayload; // Add your session property here
            validatedBody?: any;
            t: i18n.TFunction;
        }
    }
}

export { };