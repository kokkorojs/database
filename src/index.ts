import { join } from 'path';
import { ClassicLevel, DatabaseOptions } from 'classic-level';

var __dbname: string;

// TODO ／人◕ ‿‿ ◕人＼
interface DatabaseError {
  code: 'LEVEL_NOT_FOUND' | 'LEVEL_DATABASE_NOT_OPEN' | 'LEVEL_DATABASE_NOT_CLOSED';
}

export class Database<K = string, V = string> extends ClassicLevel<K, V> {
  constructor(location: string, options?: DatabaseOptions<K, V>) {
    if (__dbname) {
      location = join(__dbname, location);
    }
    super(location, options);
  }

  async has(key: K, callback?: (exists: boolean) => any): Promise<boolean> {
    let exists: boolean;

    try {
      await this.get(key);
      exists = true;
    } catch (error) {
      if ((error as any)?.code !== 'LEVEL_NOT_FOUND') {
        throw error;
      }
      exists = false;
    }
    if (callback instanceof Function) {
      callback(exists);
    }
    return exists;
  }
}
