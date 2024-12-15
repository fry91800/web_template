import express, { Router, Request, Response } from 'express';
import { User } from '../database/models/User';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import logger from '../config/logger';
import { getTablesInfo } from '../utils/database'
import { UserCredentials, UserSignUpData } from '../types/user';
import {Failure} from '../types/failure'

/*
Add the user passed in parameters in the database and return the inserted
user or throws a failure
*/
export async function signup(userSignUpData: UserSignUpData): Promise<User> {
  const transaction = await sequelize.transaction();
  try {
    const newUser = { email: userSignUpData.email, pass: userSignUpData.pass }
    const existingRecordWithMail = await User.findOne({ where: { email: userSignUpData.email }, transaction });
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

/*
Add the user passed in parameters in the database and return
both access and refresh tokens, or throws a failure
*/
export async function getLoginTokens(userCredentials: UserCredentials) {

  logger.info(`Log in attempt: mail: ${userCredentials.email}, pass: ${userCredentials.pass}`);
  const user = await User.findOne({
    where: { email: userCredentials.email }
  });
  if (!user) {
    logger.info(`Log in: Failed: Mail not found`);
    throw new Failure(400, 'Email not found', { "email": "Email not found"});
  }

  if (!await user.comparePassword(userCredentials.pass)) {
    logger.info(`Log in: Failed: Wrong pass`);
    throw new Failure(400, 'Wrong password', { "pass": "Wrong password"});
  }
  const userId = user.id;
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken }
}