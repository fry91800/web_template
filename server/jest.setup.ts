import sequelize from './src/database/database';
import app from './src/app'; // Your Express app

let server: any;

beforeAll(async () => {
  // Start the server manually for tests since it's conditionally started in app.ts
  await sequelize.sync({ force: true }); // Drop and recreate all tables
  server = app.listen(3001, () => {
    console.log('Test server running on http://localhost:3001');
  });
});


beforeEach(async () => {
  await sequelize.sync({ force: true }); // Drop and recreate all tables
});

// After all tests, close the database connection and the server
afterAll(async () => {
  await sequelize.close();
  server.close(); // Close the server
});