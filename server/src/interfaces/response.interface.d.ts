/*// types/express.d.ts
import 'express';

declare module 'express' {
  export interface Response {
    data?: any; // Define the `data` property, optionally typed for specific structures
  }
}
*/


declare global {
    namespace Express {
        interface Response {
            data?: any;
        }
    }
}

export { };