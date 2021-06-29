import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";
import connection from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());
