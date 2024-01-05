import { maxParrallelAuditAtTheSametime } from './config.js'
import { runLighthouse } from './lighthouse.js'
import limit from 'p-limit'

export async function getResultForASite(site: WebSite): Promise<Result> {
  const pagesAndResult: PageAndResultAssociate[] = []

  async function getResultForAPage(
    page: Page
  ): Promise<PageAndResultAssociate> {
    console.group(`>> Start running lighthouse for ${page.name}`)

    try {
      console.time(`Time taken for ${page.url} : `)
      const desktop = await runLighthouse(page.url)
      const mobile = await runLighthouse(page.url, true)
      console.timeEnd(`Time taken for ${page.url} : `)

      console.log(
        `> Score of ${mobile.lhr.categories.performance.score} for [mobile] ${page.url}`
      )
      console.log(
        `> Score of ${desktop.lhr.categories.performance.score} for [desktop] ${page.url}`
      )

      return {
        name: page.name,
        result: {
          mobile: (mobile.lhr.categories.performance.score || 0) * 100,
          desktop: (desktop.lhr.categories.performance.score || 0) * 100
        }
      }
    } finally {
      console.groupEnd()
    }
  }

  const limiter = limit(maxParrallelAuditAtTheSametime)

  const tasks: (() => Promise<PageAndResultAssociate>)[] = (
    site.pages || []
  ).map((page) => async () => limiter(() => getResultForAPage(page)))

  const results: PageAndResultAssociate[] = await Promise.all(
    tasks.map((task) => task())
  )

  pagesAndResult.push(...results)

  const audit: Result = {
    name: site.name,
    date: new Date().toLocaleDateString('fr-FR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }),
    pagesAndResult
  }

  console.log(`- Audit ready for : [${site.name}]`, audit)

  return audit
}
