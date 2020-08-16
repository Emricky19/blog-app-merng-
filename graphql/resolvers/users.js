const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../../config");
const { UserInputError } = require("apollo-server");
const validateRegisterInput = require("../../util/vadiators");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
    async register(_, args) {
      let {
        registerInput: { username, email, password, confirmPassword },
      } = args;
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //make sure user doesn't exist already exist
      //hash password and create an auth token
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is Already Taken", {
          errors: {
            username: "Username is already taken",
          },
        });
      }
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        confirmPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async login(_, args) {
      let { username, password } = args;

      const { errors, valid } = validateLoginInput(username, password);

      if(!valid) throw new UserInputError("Errors", { errors });

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Wrong credentials");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong Credientials";
        throw new Error("Wrong Credentials", { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
