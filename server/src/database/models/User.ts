import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function

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
}
