import { siteToAudit } from './config'
import { makeExcel } from './excel'
import { getResultForASite } from './formatResults'

async function main(sites: WebSite[]) {
  const results: Result[] = await Promise.all(
    sites.map((site) => getResultForASite(site))
  )

  makeExcel(results)
}

main(siteToAudit)
