import { z } from 'zod';
import validate from '../routes/middlewares/validate';

export const BookSchema = z
  .object({
    title: z.string().trim().min(3).max(255),
    subtitle: z.string().trim().min(3).max(255).optional(),
    isbn: z.string().trim().min(3).max(64).optional(),
    authors: z.string().trim().min(3).max(255),
    pageCount: z.number(),
    summary: z.string().trim().min(3).max(1000).optional(),
    publicationDate: z.date().optional(),
    publisher: z.string().trim().min(3).max(128).optional(),
    edition: z.string().trim().min(3).max(255).optional(),
    editors: z.string().trim().min(3).max(255).optional(),
    language: z.string().trim().min(3).max(128),
    genre: z.string().trim().min(3).max(64).optional(),
    tags: z.string().trim().min(3).max(255).optional(),
    dimensions: z.string().trim().max(128).optional(),
  })
  .strict();

const PartialBookSchema = BookSchema.partial();

type BookDynamic = {
  id: string;
  cover?: string;
  posts: string[];
  notes: string[];
  libraries: string[];
};

export type Book = z.infer<typeof BookSchema>;

export type BookEntity = Book & BookDynamic;

export type PartialBook = z.infer<typeof PartialBookSchema>;

export const bookValidator = {
  validateCreate: validate(BookSchema),
  validateUpdate: validate(PartialBookSchema),
};
