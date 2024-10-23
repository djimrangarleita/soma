export interface IRepository<L, T, K> {
  create: (doc: L) => Promise<T | never>;
  find: (
    currentUserId?: string,
    take?: number,
    skip?: number
  ) => Promise<{ collection: T[] | never; total: number }>;
  update: (id: string, doc: K) => Promise<T | never>;
  delete: (id: string) => Promise<void>;
  findOneById: (id: string) => Promise<T | null | never>;
}
