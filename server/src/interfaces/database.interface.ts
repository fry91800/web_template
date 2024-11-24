// src/interfaces/database.interface.ts
import { Sequelize } from 'sequelize-typescript';
import { QueryInterface } from 'sequelize';

// Interface to store the sequelize config
export interface DatabaseConfig {
  host: string | undefined;
  database: string;
  username: string;
  port: number | string | undefined;
}

interface ColumnInfo {
    name: string;  // The name of the column (e.g., 'updatedAt')
    type: string;  // The type of the column (e.g., 'TIMESTAMP WITH TIME ZONE')
  }

// Interface to describe table info (you can define it later with details)
export interface TableInfo {
  tableName: string;
  columns: ColumnInfo[];  // You can add more details like types for columns
  data: any[]
}

// Interface for the database object
export interface Database {
  sequelize: Sequelize;           // Sequelize instance
  config: DatabaseConfig;         // Database configuration
  queryInterface: QueryInterface;  // Sequelize's QueryInterface for raw queries
  tables: TableInfo[];         // Array of table info objects
}
