const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (userBody) => {
  console.log("REQ BODY:", userBody);

  const { name, email, password } = userBody;

  if (!name || !email || !password) {
    throw new Error("All fields required");
  }

  let user = await User.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = new User({ name, email, password: hashedPassword });
  await user.save();

  return user;
};

module.exports = { 
    createUser,
};