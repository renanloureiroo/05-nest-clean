import { HashComparer } from '@/domain/forum/application/cryptography/has-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

import { hash, compare } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT = 8

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT)
  }
}
