import { DataTypes, Model } from "sequelize";
import sequelize from "./db";

// Lazy import User to break circular dependency
let User: any;

class Challenge extends Model {
  public challenge_id!: number;
  public challenge_name!: string;
}

Challenge.init(
  {
    challenge_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    challenge_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "challenges",
    timestamps: false, // Explicitly disable timestamps
  }
);

export default Challenge;
