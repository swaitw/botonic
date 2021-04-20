import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import { NEUTRAL_ENTITY } from '../../../src/tasks/ner/process/constants'
import * as constantsHelper from '../../helpers/constants-helper'
import * as toolsHelper from '../../helpers/tools-helper'

describe('Botonic NER', () => {
  const { trainSet, testSet } = toolsHelper.dataset.split()
  const vocabulary = trainSet.extractVocabulary(toolsHelper.preprocessor)
  const sut = new BotonicNer(
    constantsHelper.LOCALE,
    constantsHelper.MAX_SEQUENCE_LENGTH,
    constantsHelper.ENTITIES,
    vocabulary,
    toolsHelper.preprocessor
  )
  sut.compile()

  test('Evaluate model', async () => {
    // arrange
    await sut.createModel('biLstm', toolsHelper.wordEmbeddingStorage)
    await sut.train(trainSet, 4, 8)

    // act
    const { loss, accuracy } = await sut.evaluate(testSet)

    // assert
    expect(loss).toBeLessThan(3)
    expect(accuracy).toBeGreaterThan(0)
  })

  test('Recognize entities', async () => {
    // arrange
    await sut.createModel('biLstm', toolsHelper.wordEmbeddingStorage)
    await sut.train(trainSet, 4, 8)

    // act
    const entities = sut.recognizeEntities('I love this tshirt')

    // assert
    expect(entities.length).toEqual(3)
  })

  test('Loading model', async () => {
    const sut = await BotonicNer.load(
      constantsHelper.NER_MODEL_DIR_PATH,
      toolsHelper.preprocessor
    )
    expect(sut.locale).toEqual(constantsHelper.LOCALE)
    expect(sut.maxLength).toEqual(constantsHelper.MAX_SEQUENCE_LENGTH)
    expect(sut.entities).toEqual(
      [NEUTRAL_ENTITY].concat(constantsHelper.ENTITIES)
    )
    expect(sut.vocabulary).toEqual(constantsHelper.VOCABULARY)
  })
})
