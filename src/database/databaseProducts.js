import pg from "pg";

const { Pool } = pg;

const connectionProducts = new Pool({
  host: "localhost",
  port: 5432,
  password: "123456",
  database: "kapyvara_store",
  user: "postgres",
});

export default connectionProducts;