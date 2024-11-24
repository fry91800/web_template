import express, { Router, Request, Response } from 'express';
import { User } from '../database/models/User';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import logger from '../config/logger';
import { getTablesInfo } from '../utils/database'

// Simply create a user, note that the pass will be hashed right before database insertion
export async function signup(email: string, pass: string){
  const newUser = { email, pass }
  await User.create(newUser);
}

// Authenticate the password associated to the mail and send a secure JWT token to the client
export async function getLoginTokens(email: string, pass: string){

    const user = await User.findOne({
        where: { email: email }
      });
      if (!user)
        {
          throw new Error("no user");
        }
      
        if (!await user.comparePassword(pass)) {
            throw new Error("wrong password");
        }
        const userId = user.id;
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);
        return {accessToken, refreshToken }
  }