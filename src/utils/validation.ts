import Joi from 'joi';
import { Request } from 'express';

export interface ValidationSchema {
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  body?: Joi.ObjectSchema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request) => {
    const errors: string[] = [];

    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) errors.push(error.details[0].message);
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) errors.push(error.details[0].message);
    }

    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) errors.push(error.details[0].message);
    }

    return errors.length ? errors : null;
  };
};

export const bookingValidation = {
  create: Joi.object({
    date: Joi.date().required(),
    time: Joi.string().required(),
    passengers: Joi.number().required().min(1),
    luggage: Joi.number().required().min(0),
    startLocation: Joi.string().required(),
    endLocation: Joi.string().required(),
    userId: Joi.string().optional(),
    driverId: Joi.string().optional(),
    status: Joi.string().valid('pending', 'confirmed', 'completed').default('pending'),
  }),
  update: Joi.object({
    date: Joi.date(),
    time: Joi.string(),
    passengers: Joi.number().min(1),
    luggage: Joi.number().min(0),
    startLocation: Joi.string(),
    endLocation: Joi.string(),
    status: Joi.string().valid('pending', 'confirmed', 'completed'),
  })
};