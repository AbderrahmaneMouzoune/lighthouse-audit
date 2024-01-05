import lighthouse, { RunnerResult } from 'lighthouse'
import puppeteer, { Browser } from 'puppeteer'

const getResultsFromLightHouse = async (browser: Browser, url: string) => {
  return await lighthouse(url, {
    port: Number(new URL(browser.wsEndpoint()).port),
    output: 'json',
    onlyCategories: ['performance']
  })
}

async function runLighthouse(
  url: string
): Promise<{ mobile: RunnerResult; desktop: RunnerResult }> {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  // Set mobile emulation if isMobile is true

  // Desktop
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const lighthouseResultDesktop = await getResultsFromLightHouse(browser, url)

  if (!lighthouseResultDesktop)
    throw new Error("Couldn't get the results of lighthouse desktop")

  // Mobile results
  await page.setViewport({
    width: 375,
    height: 667,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  })

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const lighthouseResultMobile = await getResultsFromLightHouse(browser, url)

  if (!lighthouseResultMobile)
    throw new Error("Couldn't get the results of lighthouse mobile")

  await browser.close()

  return { mobile: lighthouseResultMobile, desktop: lighthouseResultDesktop }
}

export default runLighthouse

module.exports = { runLighthouse }
