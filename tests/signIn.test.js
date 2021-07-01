import supertest from "supertest";
import app from "../src/app.js";
import connection from "../src/database";

beforeEach(async () => {
  await connection.query(`DELETE FROM sessions`);
});

afterAll(async () => {
  await connection.query(`DELETE FROM sessions`);
  connection.end();
});

describe("POST /sign-in", () => {
  it("returns 400 for a invalid e-mail ", async () => {
    const body = {
      email: "madasdasd",
      password: "123456",
    };
    const result = await supertest(app).post("/sign-in").send(body);
    expect(result.status).toEqual(400);
  });
  it("returns 400 for a invalid type of password", async () => {
    const body = {
      email: "matgmailcom",
      password: "126",
    };
    const result = await supertest(app).post("/sign-in").send(body);
    expect(result.status).toEqual(400);
  });
  it("returns 401 for a non-registered valid email", async () => {
    const body = {
      email: "mathhhhhh@gmail.com",
      password: "123456",
    };
    const result = await supertest(app).post("/sign-in").send(body);
    expect(result.status).toEqual(401);
  });
  it("returns 401 for a registered valid email and wrong valid password", async () => {
    const body = {
      email: "math@gmail.com",
      password: "123455",
    };
    const result = await supertest(app).post("/sign-in").send(body);
    expect(result.status).toEqual(401);
  });
  it("returns 200 for registered email with correct password", async () => {
    const { name, email, cpf, phone, password } = {
      email: "math@gmail.com",
      name: "math",
      cpf: "12345678910",
      phone: "21979922828",
      password: "123456",
      confirmPass: "123456",
    };
    const body = {
      email: "math@gmail.com",
      password: "123456",
    };
    await supertest(app)
      .post("/sign-up")
      .send({ name, email, cpf, phone, password });
    const result = await supertest(app).post("/sign-in").send(body);
    expect(result.status).toEqual(200);
  });
});
