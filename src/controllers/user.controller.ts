import { Request, Response } from 'express-serve-static-core';
import {
  create,
  edit,
  getCollection,
  getOneById,
  remove as removeUser,
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
  const user = await getOneById('73de8864-6cd6-4ea1-87d1-ea75d4a6dc61');

  res.send(user);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await edit(id, req.body);
  res.send(user);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeUser(id);
  res.status(204).send();
};
