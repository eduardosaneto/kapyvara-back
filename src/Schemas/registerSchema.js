import joi from "joi";

const registerSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  name: joi.string().min(3).required(),
  cpf: joi.string().min(11).max(11).required(),
  phone: joi.string().required().min(13).max(13),
  password: joi.string().required().min(6),
  confirmPass: joi.ref("password"),
});

export { registerSchema };
