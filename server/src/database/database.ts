import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User'; // Adjust path as necessary
import logger from '../config/logger';
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
  // Authenticate and sync the Sequelize instance
  sequelize
  .authenticate()
  .then(() => logger.info("Database Connection: OK"))
  .catch((err) => logger.error("Failed to authenticate:", err));
  sequelize
  .sync({ alter: true })
  .then(() => logger.info("Database Sync: OK"))
  .catch((err) => logger.error(err));
export default sequelize;
