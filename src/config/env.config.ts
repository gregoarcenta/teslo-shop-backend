import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  STRIPE_API_SECRET: Joi.string().required(),
  STRIPE_EP_SECRET: Joi.string().required(),
  STRIPE_TOKEN_SECRET: Joi.string().required(),

  APP_NAME: Joi.string().default('Example Initial App'),
  PORT: Joi.number().port().default(3000),
});
