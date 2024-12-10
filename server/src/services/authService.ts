import express, { Router, Request, Response } from 'express';
import { User } from '../database/models/User';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import logger from '../config/logger';
import { getTablesInfo } from '../utils/database'
import { UserCredentials } from '../types/user';
import {Failure} from '../types/failure'
class SignupError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'SignupError';
    Error.captureStackTrace(this, SignupError);
  }
}

// Simply create a user, note that the pass will be hashed right before database insertion
export async function signup(userCredentials: UserCredentials): Promise<User> {
  const transaction = await sequelize.transaction();
  try {
    const newUser = { email: userCredentials.email, pass: userCredentials.pass }
    const existingRecordWithMail = await User.findOne({ where: { email: userCredentials.email }, transaction });
    if (existingRecordWithMail) {
      logger.info("Sign up: Failed: Email already taken")
      throw new Failure(400, 'Email already exists', { "email": "Email already exists"});
    }
    logger.info(`Sign up: user: ${JSON.stringify(newUser)}...`);
    const inserted = await User.create(newUser, { transaction });
    logger.info(`Sign up: OK`);
    await transaction.commit();
    return inserted;
  }
  catch(err){
    await transaction.rollback();
    throw err;
  }
}

// Authenticate the password associated to the mail and send a secure JWT token to the client
export async function getLoginTokens(email: string, pass: string) {

  logger.info(`Log in: mail: ${email}, pass: ${pass}`);
  const user = await User.findOne({
    where: { email: email }
  });
  if (!user) {
    logger.info(`Log in: Failed: Mail not found`);
    throw new Failure(400, 'Email not found', { "email": "Email not found"});
  }

  if (!await user.comparePassword(pass)) {
    logger.info(`Log in: Failed: Wrong pass`);
    throw new Failure(400, 'Wrong password', { "pass": "Wrong password"});
  }
  const userId = user.id;
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken }
}