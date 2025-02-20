import User from "./user";
import Challenge from "./challenge";
import UserChallenge from "./userChallenge";

// Ensure models are initialized synchronously
const initializeAssociations = () => {
  User.belongsToMany(Challenge, {
    through: UserChallenge,
    foreignKey: "user_id",
    otherKey: "challenge_id",
  });
  Challenge.belongsToMany(User, {
    through: UserChallenge,
    foreignKey: "challenge_id",
    otherKey: "user_id",
  });
};

// Call initialization
initializeAssociations();

export { User, Challenge, UserChallenge };
