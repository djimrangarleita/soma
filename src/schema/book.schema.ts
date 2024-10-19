import { z } from 'zod';
import validate from '../routes/middlewares/validate';

export const BookSchema = z
  .object({
    title: z.string().trim().min(3).max(255),
    subtitle: z.string().trim().min(3).max(255).optional(),
    isbn: z.string().trim().min(3).max(64).optional(),
    authors: z.array(z.string()),
    pageCount: z.number(),
    summary: z.string().trim().min(3).max(1000).optional(),
    publicationDate: z.date().optional(),
    publisher: z.string().trim().min(3).max(128).optional(),
    edition: z.string().trim().min(3).max(255).optional(),
    editors: z.array(z.string()).optional(),
    language: z.string().trim().min(3).max(128),
    genre: z.string().trim().min(3).max(64).optional(),
    tags: z.array(z.string()).optional(),
    dimensions: z.string().trim().max(128).optional(),
    cover: z.string().optional().nullable(),
  })
  .strict();

const PartialBookSchema = BookSchema.partial();

type BookDynamic = {
  id: string;
};

export type Book = z.infer<typeof BookSchema>;

export type BookEntity = Book & BookDynamic;

export type PartialBook = z.infer<typeof PartialBookSchema>;

export const bookValidator = {
  validateCreate: validate(BookSchema),
  validateUpdate: validate(PartialBookSchema),
};
