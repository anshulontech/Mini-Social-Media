const express = require(`express`);
const router = express.Router();
const { Users } = require(`../models`);
const bcrypt = require(`bcrypt`);
const { sign } = require(`jsonwebtoken`);
const { validateToken } = require("../middleware/AuthMiddleware");

router.post(`/`, async (req, res) => {
  const { username, password } = req.body;

  const newpassword = await bcrypt.hash(password, 10);
  const userToAdd = {
    username: username,
    password: newpassword,
  };

  Users.create(userToAdd);
  res.json(userToAdd);
});

router.post(`/login`, async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    res.json({ error: "Invalid Credentials 1" });
  }

  const isValidLogin = await bcrypt.compare(password, user.password);

  if (!isValidLogin) res.json({ error: "Invalid credentials 2" });

  const accesToken = sign(
    { username: user.username, id: user.id },
    "importantSecret"
  );
  res.json({ token: accesToken, username: user.username, id: user.id });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) {
      res.json({ error: "Password not Match." });
    } else {
      bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update(
          { password: hash },
          { where: { username: req.user.username } }
        );
        res.json("SUCCESS!!!");
      });
    }
  });
});

module.exports = router;
