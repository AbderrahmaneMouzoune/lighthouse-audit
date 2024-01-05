import { siteToAudit } from './config.js'
import { makeExcel } from './excel.js'
import { getResultForASite } from './formatResults.js'

export default async function main(sites: WebSite[]) {
  const results: Result[] = await Promise.all(
    sites.map((site) => getResultForASite(site))
  )

  makeExcel(results)
}

main(siteToAudit)
