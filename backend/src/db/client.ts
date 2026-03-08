export interface DbClient {
  query<T>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

class NoopDbClient implements DbClient {
  async query<T>(_sql: string, _params: unknown[] = []): Promise<{ rows: T[] }> {
    return { rows: [] };
  }
}

export const dbClient: DbClient = new NoopDbClient();
