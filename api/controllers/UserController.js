const User = require("../models/UserModel");
const { generateToken } = require("../middlewares/authMiddleware");

const createUser = async (req, res) => {
  const data = req.body;

  let user = await User.find({ username: req.body?.username });
  console.log(user);
  if (user.length != 0) {
    return res
      .status(401)
      .send({ detail: "User already exists with username." });
  }
  user = await User.create(data);
  user.encryptedPassword = undefined;
  user.salt = undefined;
  return res.status(200).send(user._doc);
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.city = req.body?.city || user.city;
    user.outlet = req.body?.outlet || user.outlet || ""
    console.log(user);
    console.log(req.body);
    user.updatedAt = Date.now();
    await user.save();
    user.encryptedPassword = undefined;
    user.salt = undefined;

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(403).send({ detail: "Error occurred." });
  }
};

const getUser = async (req, res) => {
  const user = req.user;
  user.encryptedPassword = undefined;
  user.salt = undefined;
  return res.status(200).send(user);
};

const loginUser = async (req, res) => {
  const body = req.body;

  if (!body?.username || !body?.password)
    return res.status(400).send({ detail: "Enter username and password." });

  const user = await User.findOne({ username: body.username });

  if (!user)
    return res
      .status(401)
      .send({ detail: "No user found with username " + body.username });
  console.log(user);
  if (user.authenticate(body.password)) {
    user.encryptedPassword = undefined;
    user.salt = undefined;
    return res.status(200).send({
      success: true,
      token: generateToken(user._doc),
      ...user._doc,
    });
  } else {
    return res.status(401).send({
      detail: "Username or password is invalid.",
    });
  }
};

module.exports = { createUser, updateUser, getUser, loginUser };
