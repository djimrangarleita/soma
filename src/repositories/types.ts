export interface IRepository<L, T, K> {
  create: (doc: L) => Promise<T | never>;
  find: () => Promise<T[] | never>;
  update: (id: string, doc: K) => Promise<T | never>;
  delete: (id: string) => Promise<void>;
  findOneById: (id: string) => Promise<T | null | never>;
}
