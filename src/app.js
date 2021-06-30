import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import connection from "./database.js";
import { registerSchema } from "./Schemas/registerSchema.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", async (req, res) => {
  try {
    const validation = registerSchema.validate(req.bod);

    if (validation.error) {
      return res.sendStatus(400);
    }

    const { email, name, cpf, phone, password } = req.body;
    const hashPass = bcrypt.hashSync(password, 10);
    const alreadyInUse = await connection.query(
      `
      SELECT * FROM users
      WHERE "userName" = $1
      OR email = $2
      OR cpf = $3
      `,
      [name, email, cpf]
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
    console.log(e);
    res.sendStatus(500);
  }
});

export default app;
