import { Preprocessor } from '../preprocess'
import { PADDING_TOKEN } from '../preprocess/constants'
import { Vocabulary } from '../preprocess/vocabulary'
import { flatten, shuffle as shuffleArray, unique } from '../utils/array-utils'
import { DatasetLoader } from './loader'
import { Sample } from './types'

export class Dataset {
  constructor(
    readonly classes: string[],
    readonly entities: string[],
    readonly samples: Sample[]
  ) {}

  static load(path: string): Dataset {
    return DatasetLoader.load(path)
  }

  split(
    testProportion = 0.2,
    shuffle = true
  ): { trainSet: Dataset; testSet: Dataset } {
    if (1 < testProportion || testProportion < 0) {
      throw new RangeError(`testProportion must be a number between 0 and 1.`)
    }
    const samples = shuffle ? shuffleArray(this.samples) : this.samples
    const trainSamples = samples.slice(testProportion * samples.length)
    const testSamples = samples.slice(0, testProportion * samples.length)
    return {
      trainSet: new Dataset(this.classes, this.entities, trainSamples),
      testSet: new Dataset(this.classes, this.entities, testSamples),
    }
  }

  extractVocabulary(
    preprocessor: Preprocessor,
    additionalTokens: string[] = []
  ): Vocabulary {
    const sequences = this.samples.map(sample =>
      preprocessor.preprocess(sample.text, PADDING_TOKEN)
    )
    const tokens = flatten(sequences)
    const uniqueTokens = unique(tokens)
    const filteredTokens = uniqueTokens.filter(token => token !== PADDING_TOKEN)
    const finalTokens = additionalTokens.concat(filteredTokens)
    return new Vocabulary(finalTokens)
  }

  get length(): number {
    return this.samples.length
  }
}