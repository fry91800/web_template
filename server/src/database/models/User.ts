import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'users', // Explicitly set the table name if needed
  timestamps: true,   // Add createdAt and updatedAt fields
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string; // The name column
}
