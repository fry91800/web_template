import express, { Router, Request, Response } from 'express';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import logger from '../config/logger';
export async function getDatabaseInfo() {
  const User = sequelize.model(`User`)
//   const description = await User.describe()
//     .then(data => {
//       const res = []
//       for (const [key, value] of Object.entries(data)) {
//         res.push({
//           key,
//           type: value.type
//         })
//       }
//       return res
//     })
//  console.log(description)
  const tables: TableInfo[] = [];
  for (const modelName of Object.keys(sequelize.models)) {
    const model = sequelize.models[modelName];
    const columns = await model.describe()
    .then(data => {
      const res = []
      for (const [key, value] of Object.entries(data)) {
        res.push({
          name: key,
          type: value.type
        })
      }
      return res
    })
    // Fetch all data from the table
    const data = await model.findAll();
    //const columns = Object.keys(model.getAttributes);
    // Push table name and data to result array
    tables.push({
      tableName: modelName.toLowerCase(), // Table name in lowercase
      columns: columns,  // You can add more details like types for columns
      data: data
    });
  }
  const databaseInfo = {
    sequelize,
    config: {
      host: sequelize.config.host,     // Extract from sequelize config
      database: sequelize.config.database, // Extract from sequelize config
      username: sequelize.config.username, // Extract from sequelize config
      port: sequelize.config.port,         // Extract from sequelize config
    },
    queryInterface: sequelize.getQueryInterface(),
    tables: tables,  // Pass the table info
  };
  return databaseInfo

  //   // Loop through all registered models in Sequelize
  //   for (const modelName of Object.keys(sequelize.models)) {
  //     const model = sequelize.models[modelName];

  //     // Fetch all data from the table
  //     const data = await model.findAll();

  //     // Push table name and data to result array
  //     result.push({
  //       table: modelName.toLowerCase(), // Table name in lowercase
  //       data,
  //     });
  //   }
  //   return result
}