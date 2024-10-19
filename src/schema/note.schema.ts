import { z } from 'zod';
import validate from '../routes/middlewares/validate';

export const NoteTypeV = { NOTE: 'NOTE', QUOTE: 'QUOTE' } as const;

export type NoteType = (typeof NoteTypeV)[keyof typeof NoteTypeV];

type NoteDynamic = {
  id: string;
  userId: string;
};

export const NoteSchema = z
  .object({
    text: z.string().max(512),
    reference: z.string().max(128),
    type: z
      .enum(Object.values(NoteTypeV) as [NoteType, ...NoteType[]])
      .optional(),
    isPublic: z.boolean().nullable().optional(),
    attachment: z.string().nullable().optional(),
    bookId: z.string().nullable().optional(),
  })
  .strict();

const PartialNoteSchema = NoteSchema.partial();

export type Note = z.infer<typeof NoteSchema>;

export type NoteEntity = Note & NoteDynamic;

export const noteValidator = {
  validateCreate: validate(NoteSchema),
  validateUpdate: validate(PartialNoteSchema),
};
