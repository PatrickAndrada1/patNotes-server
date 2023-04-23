// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const port = process.env.PORT || 3000;
const { Note, User } = require("./models");
const { comparehash } = require("./helper/bcrypt");
const { createToken } = require("./helper/jwt");
const { authentication } = require("./middleware/authentication");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req,res) =>{
//     res.send({message: "patNotesReady"})
// })

app.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.create({ username, email, password });
    res
      .status(201)
      .json({ message: `User with email ${user.email} has been created` });
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email) throw { name: "Mohon mengisi Email" };
    if (!password) throw { name: "Mohon mengisi Password" };
    let user = await User.findOne({ where: { email } });
    if (!user) throw { name: "InvalidCredentials" };
    let compared = comparehash(password, user.password);
    if (!compared) throw { name: "InvalidCredentials" };
    let payload = {
      id: user.id,
    };
    let access_token = createToken(payload);
    let data = {
      access_token: access_token,
      username: user.username,
      id: user.id,
      email: user.email,
    };
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/notes", authentication, async (req, res, next) => {
  try {
    let data = await Note.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "ASC"]],
    });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.post("/notes", authentication, async (req, res, next) => {
  const { name, isDone } = req.body;
  try {
    let UserId = req.user.id;
    let data = await Note.create({ name, isDone, UserId });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.get("/users", authentication, async (req, res, next) => {
  try {
    let { email } = req.user;
    let data = await User.findOne({
      where: { email: email },
      include: {
        model: Note,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.patch("/:id", authentication, async (req, res, next) => {
  const { id } = req.params;
  const { isDone } = req.body;
  try {
    let note = await Note.findByPk(id);
    let data = await Note.update({ isDone }, { where: { id: id } });
    res.status(200).json({ message: `${note.name} selesai dilaksanakan` });
  } catch (error) {
    next(error);
  }
});

app.delete("/:id", authentication, async (req, res, next) => {
  const { id } = req.params;
  try {
    let note = await Note.findByPk(id);
    let data = await Note.destroy({ where: { id: id } });
    res.status(200).json({ message: `${note.name} telah dihapus` });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`on port ${port}`);
});
