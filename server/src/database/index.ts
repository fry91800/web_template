import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User'; // Adjust path as necessary

console.log(process.env.DB_PASS)
// Initialize Sequelize instance
const sequelize = new Sequelize({
  dialect: 'postgres', // Use 'mysql', 'sqlite', 'mssql', etc., if different
  host: process.env.DB_HOST,   // Your database host
  username: process.env.DB_USER ,
  password: process.env.DB_PASS ,
  database: process.env.DB_NAME ,
  models: [User],      // Add models here
  logging: false,      // Disable SQL query logging (set true for debugging)
});

export default sequelize;
