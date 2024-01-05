import lighthouse, { RunnerResult } from 'lighthouse'
import puppeteer, { Browser } from 'puppeteer'

export async function runLighthouse(
  url: string
): Promise<{ mobile: RunnerResult; desktop: RunnerResult }> {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreDefaultArgs: ['--enable-automation']
  })
  const page = await browser.newPage()

  // Desktop
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const lighthouseResultDesktop = await lighthouse(url, {
    port: Number(new URL(browser.wsEndpoint()).port),
    output: 'json',
    onlyCategories: ['performance']
  })

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

  const lighthouseResultMobile = await lighthouse(url, {
    port: Number(new URL(browser.wsEndpoint()).port),
    output: 'json',
    onlyCategories: ['performance']
  })

  if (!lighthouseResultMobile)
    throw new Error("Couldn't get the results of lighthouse mobile")

  await browser.close()

  return { mobile: lighthouseResultMobile, desktop: lighthouseResultDesktop }
}
