import express, { Router, Request, Response } from 'express';
import { User } from '../database/models/User';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import logger from '../config/logger';
import { getTablesInfo } from '../utils/database'
import { UserCredentials } from '../types/user';
import {Failure} from '../types/failure'

// Upload a file
export async function uploadFromFile(type: string, file: Express.Multer.File | undefined) {
    if (!file) {
        throw new Failure(400, 'No file uploaded', { "file": "No file uploaded"});
    }
      return
  }