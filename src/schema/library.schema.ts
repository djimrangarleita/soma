import { z } from 'zod';
import validate from '../routes/middlewares/validate';

export const Shelf = {
  LIKE: 'LIKE',
  HAVE: 'HAVE',
  WANT_TO_READ: 'WANT_TO_READ',
  READING: 'READING',
  RED: 'RED',
} as const;

export type ShelfType = (typeof Shelf)[keyof typeof Shelf];

type LibraryDynamic = {
  id: string;
  userId: string;
};

const LibrarySchema = z.object({
  bookId: z.string(),
  shelf: z.enum(Object.values(Shelf) as [ShelfType, ...ShelfType[]]).optional(),
  status: z.string().optional(),
  stopOn: z.string().max(128).optional().nullable(),
  readingCompletionDate: z.date().optional().nullable(),
  rating: z.number().min(1).max(5),
});

const PartialLibrarySchema = LibrarySchema.partial();

export type Library = z.infer<typeof LibrarySchema>;

export type PartialLibrary = z.infer<typeof PartialLibrarySchema>;

export type LibraryEntity = Library & LibraryDynamic;

export const libraryValidator = {
  validateCreate: validate(LibrarySchema),
  validateUpdate: validate(PartialLibrarySchema),
};
