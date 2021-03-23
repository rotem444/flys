const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Users, validationUser, flightValidation } = require("./DB/Users");
const { parse } = require("querystring");
const validMW = require("./validation");
require("dotenv").config();
const { PORT = 3000, SESSION_SECRET, HASH = "key" } = process.env;

require("./DB/connect");
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use(validMW);

app.post("/signin", async ({ body }, res) => {
  try {
    let user = await Users.findOne(_.pick(body, "email"), { password: 1 });
    if (!user) return res.status(404).send("email not found");
    let bool = await bcrypt.compare(body.password, user.password);
    if (!bool) return res.status(404).send("invalide password");
    res.send({ token: jwt.sign(_.pick(user, "_id"), HASH) });
  } catch (err) {
    return res.status(404).send(err);
  }
});

app.post("/signup", async ({ body }, res) => {
  try {
    if (await Users.findOne(_.pick(body, "email"))) {
      return res.status(404).send("user whit the same email allrdy exist");
    }
    body.password = await bcrypt.hash(body.password, 12);
    await new Users(body).save();
    return res.send(`user ${body.name}, save sucssesfuly`);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.put("/putfly", autont, async ({ body, _id }, res) => {
  try {
    await Users.findByIdAndUpdate(_id, { $push: { flights: body } });
    res.send("data save sucsesfuly");
  } catch (err) {
    res.status(404).send(err);
  }
});

app.post("/getfly", async ({ body: { name, ...$elemMatch } }, res) => {
  name = name ? { name } : {};
  let data = await Users.find(name, {
    name: 1,
    _id: 0,
    flights: { $elemMatch },
  });

  res.send(
    data.reduce(
      (arr, { name, flights }) =>
        arr.concat(
          flights.map(({ target, date, namber }) => ({
            name,
            target,
            date,
            namber,
          }))
        ),
      []
    )
  );
});

async function autont(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.send("token reqid");
  try {
    const decod = jwt.verify(token, HASH);
    if (!decod) return res.status(404).send("invalid token");
    req._id = decod._id;
    next();
  } catch (err) {
    res.status(404).send(err);
  }
  res.body._id = token._id;
  next();
}

app.listen(PORT, () => console.log(`start lisner in posrt ${PORT}`));
