import {
  DataTypes,
  Model,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
} from "sequelize";
import sequelize from "./db";

// Lazy import Challenge to break circular dependency
let Challenge: any;

class User extends Model {
  public user_id!: number;
  public email!: string;
  public password_hash!: string;
  public name?: string;
  public location?: string;
  public age_range?: string;
  public interaction_preference?: string;
  public other_interaction_preference?: string;

  // Add association methods for challenges
  public getChallenges!: HasManyGetAssociationsMixin<typeof Challenge>;
  public setChallenges!: HasManySetAssociationsMixin<typeof Challenge, number>;
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: DataTypes.STRING(255),
    location: DataTypes.STRING(255),
    age_range: DataTypes.STRING(50),
    interaction_preference: DataTypes.STRING(50),
    other_interaction_preference: DataTypes.STRING(255),
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false, // Explicitly disable timestamps
  }
);

export default User;
