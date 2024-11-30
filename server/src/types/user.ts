import {User} from '../database/models/User'

export type UserCredentials = Pick<User, 'email' | 'pass'>;

export type UserSignUpData = Pick<User, 'email' | 'pass'>;