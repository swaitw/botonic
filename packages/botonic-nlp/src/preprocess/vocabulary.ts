import { unique } from '../utils/array-utils'

export class Vocabulary {
  readonly tokens: string[]
  readonly length: number

  constructor(tokens: string[]) {
    this.tokens = unique(tokens)
    this.length = this.tokens.length
  }

  includes(token: string): boolean {
    return this.tokens.includes(token)
  }

  getTokenId(token: string): number {
    if (!this.includes(token)) {
      throw new Error(`Token '${token}' not found in vocabulary.`)
    }
    return this.tokens.indexOf(token)
  }

  getToken(id: number): string {
    if (!this.isValidId(id)) {
      throw new Error(`Invalid Token Id '${id}'.`)
    }
    return this.tokens[id]
  }

  private isValidId(id: number): boolean {
    return 0 <= id && id < this.length
  }
}