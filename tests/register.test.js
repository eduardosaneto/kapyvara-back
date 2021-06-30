import supertest from "supertest";
import app from "../src/app.js";
import connection from "../src/database";

beforeEach(async () => {
  await connection.query(`DELETE FROM users`);
});

afterAll(async () => {
  await connection.query(`DELETE FROM users`);
  connection.end();
});

describe("POST /sign-up", () => {
  it("returns 409 for already registred email OR cpf", async () => {
    const { name, email, cpf, phone, password } = {
      email: "mat@gmail.com",
      name: "math",
      cpf: "12345678910",
      phone: "21979922828",
      password: "123456",
      confirmPass: "123456",
    };
    await connection.query(
      `
      INSERT INTO users
      ("userName", email, cpf, phone, password)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, email, cpf, phone, password]
    );
    await connection.query(
      `
      INSERT INTO users
      ("userName", email, cpf, phone, password)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, email, cpf, phone, password]
    );
  });
  it("returns 400 for a wrong cpf valid number ", async () => {
    const body = {
      email: "mat@gmail.com",
      name: "math",
      cpf: "1234567890",
      phone: "21979922828",
      password: "123456",
      confirmPass: "123456",
    };
    const result = await supertest(app).post("/sign-up").send(body);
    expect(result.status).toEqual(400);
  });
  it("returns 400 for a wrong validated email", async () => {
    const body = {
      email: "matgmailcom",
      name: "math",
      cpf: "12345678910",
      phone: "21979922828",
      password: "123456",
      confirmPass: "123456",
    };
    const result = await supertest(app).post("/sign-up").send(body);
    expect(result.status).toEqual(400);
  });
  it("returns 400 for less than 3 characters in name validation", async () => {
    const body = {
      email: "mat@gmail.com",
      name: "ma",
      cpf: "12345678910",
      phone: "21979922828",
      password: "123456",
      confirmPass: "123456",
    };
    const result = await supertest(app).post("/sign-up").send(body);
    expect(result.status).toEqual(400);
  });
  it("returns 400 for differents password and confirmPass", async () => {
    const body = {
      email: "mat@gmail.com",
      name: "ma",
      cpf: "12345678910",
      phone: "21979922828",
      password: "123456",
      confirmPass: "1234567",
    };
    const result = await supertest(app).post("/sign-up").send(body);
    expect(result.status).toEqual(400);
  });
  it("returns 400 for incorrect phone numbers", async () => {
    const body = {
      email: "mat@gmail.com",
      name: "math",
      cpf: "12345678910",
      phone: "21979828",
      password: "123456",
      confirmPass: "123456",
    };
    const result = await supertest(app).post("/sign-up").send(body);
    expect(result.status).toEqual(400);
  });
  it("returns 201 for correct body keys", async () => {
    const body = {
      email: "mat@gmail.com",
      name: "math",
      cpf: "12345678910",
      phone: "21979922828",
      password: "123456",
      confirmPass: "123456",
    };
    const result = await supertest(app).post("/sign-up").send(body);
    expect(result.status).toEqual(201);
  });
  it("returns 201 for correct body keys", async () => {
    const body = {
      email: "mat@gmail.com",
      name: "math",
      cpf: "12345678910",
      phone: "21979922828",
      password: "123456",
      confirmPass: "123456",
    };
    const result = await supertest(app).post("/sign-up").send(body);
    expect(result.status).toEqual(201);
  });
});
