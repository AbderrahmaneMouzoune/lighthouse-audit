import lighthouse from "lighthouse"
import { URL } from "url"
import puppeteer from "puppeteer"
import ExcelJS from "exceljs"

const sitesToAudit = [
  {
    name: "Mon portfolio",
    urls: [
      "https://abderrahmanemouzoune.com",
      "https://abderrahmanemouzoune.com/portfolio",
      // Ajoutez toutes les URL de landing pour le site 1
    ],
  },
  {
    name: "Portfolio d'Ahmed",
    urls: [
      "https://ahmedmouzoune.com",
      // Ajoutez toutes les URL de landing pour le site 1
    ],
  },
  // Ajoutez d'autres sites au besoin
]

async function runLighthouse(url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: "domcontentloaded" })

  const lighthouseResult = await lighthouse(
    url,
    { port: new URL(browser.wsEndpoint()).port },
    null
  )

  await browser.close()

  return lighthouseResult.report
}

async function createExcelFile(results) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Lighthouse Audit Results")

  // Ajouter une ligne d'en-tête
  worksheet.addRow([
    "Site",
    "URL",
    "Performance",
    "Accessibility",
    "Best Practices",
    "SEO",
  ])

  // Ajouter les résultats pour chaque site et URL
  results.forEach((result) => {
    const { siteName, url, categories } = result

    worksheet.addRow([
      siteName,
      url,
      categories.performance.score * 100,
      categories.accessibility.score * 100,
      categories["best-practices"].score * 100,
      categories.seo.score * 100,
    ])
  })

  // Sauvegarder le fichier Excel
  await workbook.xlsx.writeFile("audit_result/lighthouse_results.xlsx")
}

async function main() {
  const auditResults = []

  for (const site of sitesToAudit) {
    const { name: siteName, urls } = site

    for (const url of urls) {
      try {
        const report = await runLighthouse(url)
        const result = JSON.parse(report)
        auditResults.push({ siteName, url, categories: result.categories })
        console.log(`Audit for ${siteName} - ${url}:`)
        console.log(report)
      } catch (error) {
        console.error(`Error auditing ${siteName} - ${url}: ${error.message}`)
      }
    }
  }

  // Créer le fichier Excel avec les résultats d'audit
  await createExcelFile(auditResults)

  console.log("Excel file created: audit_result/lighthouse_results.xlsx")
}

main()
