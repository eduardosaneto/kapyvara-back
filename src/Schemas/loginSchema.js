import joi from "joi";

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  password: joi.string().required().min(6),
});

export { loginSchema };
