import lighthouse, { RunnerResult } from 'lighthouse'
import puppeteer, { Browser } from 'puppeteer'

export async function runLighthouse(
  url: string,
  isMobile?: boolean
): Promise<RunnerResult> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  if (isMobile) {
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    })
  }

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const lighthouseResult = await lighthouse(url, {
    port: Number(new URL(browser.wsEndpoint()).port)
  })

  if (!lighthouseResult)
    throw new Error(
      `Could not get result for lighthouse [${isMobile ? 'mobile' : 'desktop'}]`
    )

  await browser.close()

  return lighthouseResult
}
