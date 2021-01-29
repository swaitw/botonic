import { KeywordsOptions, MatchType, Normalizer, Search, SPANISH } from '../../src'
import {
  Measure,
  Profiler
} from '../../src/util/profiler'
import { testContentful } from './contentful.helper'
import { TEST_POST_FAQ1_ID } from './contents/text.test'

test('INTEGRATION TEST: performance', async () => {
  Profiler.enable()
  const contentful = testContentful({ disableCache: true })
  const t = await contentful.text(TEST_POST_FAQ1_ID, { locale: SPANISH })
  console.log(t.text)
  const normalizer = new Normalizer()
  const sut = new Search(contentful, normalizer, {
    es: new KeywordsOptions(1),
  })

  for (let i = 0; i < 1000; i++) {
    const searchM = new Measure('nothing')
    searchM.end()
  }

  const loopM = new Measure('LOOP')
  for (let i = 0; i < 10; i++) {
    const searchM = new Measure('searchByKeywords')
    const res = await sut.searchByKeywords(
      'mi pedido no encuentro',
      MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP,
      {
        locale: 'es',
      }
    )
    console.log(res.length)
    console.log('hola')
    searchM.end()
    // expect(res.length).toBeGreaterThanOrEqual(1)
    // expect(res.filter(res => res.common.name == 'POST_FAQ1')).toHaveLength(1)
    // console.log(stringSummaryAll())
  }
  loopM.end()
  console.log(Profiler.getSummaryAll())
  Profiler.disable()
})
