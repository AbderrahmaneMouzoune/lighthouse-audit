import { runLighthouse } from './lighthouse.js'

export async function getResultForASite(site: WebSite): Promise<Result> {
  const getResultForAPage = async (
    page: Page
  ): Promise<PageAndResultAssociate> => {
    const desktop = await runLighthouse(page.url)
    const mobile = await runLighthouse(page.url, true)

    return {
      name: page.name,
      result: {
        mobile: (mobile.lhr.categories.performance.score || 0) * 100,
        desktop: (desktop.lhr.categories.performance.score || 0) * 100
      }
    }
  }

  const pagesAndResult: PageAndResultAssociate[] = await Promise.all(
    (site.pages || []).map(getResultForAPage)
  )

  return {
    name: site.name,
    date: new Date().toLocaleDateString('fr-FR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }),
    pagesAndResult
  }
}
