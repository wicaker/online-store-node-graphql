const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  // @mutation createUser(userInput: UserInput) : User
  // @desc register user
  // @access Public
  createUser: args => {
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error("User already exist.");
        }
        //hash password
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          name: args.userInput.name,
          email: args.userInput.email,
          password: hashedPassword,
          status: args.userInput.status
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, password: null, _id: result.id };
      })
      .catch(err => {
        throw err;
      });
  },

  // @query login(email: String!, password: String!) : AuthData!
  // @desc login function
  // @access Public
  login: async ({ email, password }) => {
    //args.email, args.password
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    //compare password incoming request and user password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    //create token with store data user id and email
    const token = jwt.sign(
      { userId: user.id, email: user.email, status: user.status },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "1h"
      }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
      status: user.status
    };
  }
};
