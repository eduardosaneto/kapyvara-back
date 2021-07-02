import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import connection from "./database.js";
import connectionProducts from "./database/databaseProducts.js";
import { registerSchema } from "./Schemas/registerSchema.js";
import { loginSchema } from "./Schemas/loginSchema.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", async (req, res) => {
  try {
    const validation = registerSchema.validate(req.body);

    if (validation.error) {
      //console.log(validation.error);
      return res.sendStatus(400);
    }

    const { email, name, cpf, phone, password } = req.body;
    const hashPass = bcrypt.hashSync(password, 10);
    const alreadyInUse = await connection.query(
      `
      SELECT * FROM users
      WHERE email = $1
      OR cpf = $2
      `,
      [email, cpf]
    );
    if (alreadyInUse.rows[0]) {
      return res.sendStatus(409);
    }
    const resp = await connection.query(
      `
      INSERT INTO users
      ("userName", email, cpf, phone, password)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, email, cpf, phone, hashPass]
    );
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
});

app.post("/sign-in", async (req, res) => {
  try {
    const validation = loginSchema.validate(req.body);

    if (validation.error) {
      console.log(validation.error);
      return res.sendStatus(400);
    }
    const { email, password } = req.body;

    const result = await connection.query(
      `
    SELECT * FROM users
    WHERE email = $1
    `,
      [email]
    );

    const user = result.rows[0];
    if (user && bcrypt.compareSync(password, user.password)) {
      delete user.password;
      const token = uuid();
      await connection.query(
        `
      INSERT INTO sessions (token, "userId")
      VALUES ($1, $2)
      `,
        [token, user.id]
      );
      res.status(200).send({ token, user });
    } else {
      res.sendStatus(401);
    }
  } catch (e) {}
});

app.get("/home", async (req, res) => {
  try {
    const result = await connection.query(`SELECT * FROM products`);
    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post("/sales", async (req, res) => {
  try {
    const authorization = req.header("authorization");
    const token = authorization?.replace("Bearer ", "");
    const { userId, total, description } = req.body;

    const result = await connection.query(
      `
      SELECT * FROM sessions
      WHERE token = $1 
    `,
      [token]
    );

    if (result.rows.length === 0) {
      return res.sendStatus(401);
    }

    await connection.query(
      `
       INSERT INTO sales ("userId", total, description)
       VALUES ($1, $2, $3)
       `,
      [userId, total, description]
    );
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

export default app;
