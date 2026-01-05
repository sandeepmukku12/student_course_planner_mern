const { userService, tokenService, authService } = require("../services");
const secretKey = process.env.JWT_SECRET;

// Signup
const signup = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    const token = tokenService.generateToken(user._id, secretKey);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error.message);

    return res.status(400).json({
      msg: error.message || "Signup failed",
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser(email, password);

    const token = tokenService.generateToken(user._id, secretKey);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ msg: error.message });
  }
};

module.exports = {
    signup,
    login,
};