import { DataTypes, Model } from "sequelize";
import sequelize from "./db";
import User from "./user";
import Challenge from "./challenge";

class UserChallenge extends Model {
  public user_id!: number;
  public challenge_id!: number;
}

UserChallenge.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: User, key: "user_id" },
    },
    challenge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: Challenge, key: "challenge_id" },
    },
  },
  {
    sequelize,
    tableName: "user_challenges",
    timestamps: false, // Explicitly disable timestamps
  }
);

export default UserChallenge;
