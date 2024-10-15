import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const validate =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.map(e => ({ path: e.path[0], message: e.message }));
      }
      res.status(422).send({
        statusCode: 422,
        error: err,
      });
    }
  };

export default validate;
