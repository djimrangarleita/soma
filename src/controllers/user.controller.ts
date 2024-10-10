import { Request, Response } from 'express-serve-static-core';
import {
  create,
  edit,
  getCollection,
  getOneById,
} from '../services/user.service';

export const getAll = async (req: Request, res: Response) => {
  const users = await getCollection();

  res.send(users);
};

export const register = async (req: Request, res: Response) => {
  const user = await create(req.body);

  res.status(201).send(user);
};

export const getProfile = async (req: Request, res: Response) => {
  const user = await getOneById('6419c0b6-8d30-4b17-9ba6-3b9c89e855ef');

  res.send(user);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await edit(id, req.body);
  res.send(user);
};
