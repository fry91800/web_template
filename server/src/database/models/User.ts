import { Table, Column, Model, DataType, BeforeCreate, PrimaryKey, Default } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function
import logger from '../../config/logger'

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);

@Table({
  tableName: 'users', // Explicitly set the table name if needed
  timestamps: true,   // Add createdAt and updatedAt fields
})
export class User extends Model {
  @PrimaryKey
  @Default(uuidv4) // Default to generating a UUID value for new users
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: string; // The primary key of the user table

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true, // Optional: Ensure emails are unique
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pass!: string;

  // Hash the password before saving the user to the database
  //@BeforeCreate
  static async hashPassword(pass: string) {
      return bcrypt.hash(pass, saltRounds);
  }

  // Method to compare the password with the hashed password
  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.pass); // Compare with the stored hash
  }
  static registerHooks() {
    this.beforeCreate(async (user) => {
      if (user.pass)
      {
        user.pass = await User.hashPassword(user.pass)
      }
    });
    this.beforeBulkCreate(async (users) => {
      for (const user of users) {
        if (user.pass)
          {
            user.pass = await User.hashPassword(user.pass)
          }
      }
    });
    this.beforeUpdate(async (user) => {
      if (user.pass)
        {
          user.pass = await User.hashPassword(user.pass)
        }
    });
  }
}



