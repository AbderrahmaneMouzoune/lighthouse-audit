import lighthouse from "lighthouse"
import { URL } from "url"
import puppeteer from "puppeteer"
import ExcelJS from "exceljs"
import path from "path"

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

async function runLighthouse(url, isMobile) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Définir l'émulation mobile si isMobile est true
  if (isMobile) {
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    })
  }

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
  const auditResultsFolder = "audit_results"
  const excelFilePath = path.join(auditResultsFolder, "lighthouse_results.xlsx")

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Lighthouse Audit Results")

  // Ajouter une ligne d'en-tête
  worksheet.addRow([
    "Site",
    "URL",
    "Mobile Performance",
    "Desktop Performance",
    "Mobile Accessibility",
    "Desktop Accessibility",
    "Mobile Best Practices",
    "Desktop Best Practices",
    "Mobile SEO",
    "Desktop SEO",
  ])

  // Ajouter les résultats pour chaque site et URL
  results.forEach((result) => {
    const { siteName, url, categories } = result

    worksheet.addRow([
      siteName,
      url,
      categories.performance.mobile * 100,
      categories.performance.desktop * 100,
      categories.accessibility.mobile * 100,
      categories.accessibility.desktop * 100,
      categories["best-practices"].mobile * 100,
      categories["best-practices"].desktop * 100,
      categories.seo.mobile * 100,
      categories.seo.desktop * 100,
    ])
  })

  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(auditResultsFolder)) {
    fs.mkdirSync(auditResultsFolder)
  }

  // Sauvegarder le fichier Excel
  await workbook.xlsx.writeFile(excelFilePath)

  console.log(`Excel file created: ${excelFilePath}`)
}

async function main() {
  const auditResults = []

  for (const site of sitesToAudit) {
    const { name: siteName, urls } = site

    for (const url of urls) {
      try {
        // Audit pour la version mobile
        const mobileReport = await runLighthouse(url, true)
        const mobileResult = JSON.parse(mobileReport)

        // Audit pour la version desktop
        const desktopReport = await runLighthouse(url, false)
        const desktopResult = JSON.parse(desktopReport)

        auditResults.push({
          siteName,
          url,
          categories: {
            performance: {
              mobile: mobileResult.categories.performance.score,
              desktop: desktopResult.categories.performance.score,
            },
            accessibility: {
              mobile: mobileResult.categories.accessibility.score,
              desktop: desktopResult.categories.accessibility.score,
            },
            "best-practices": {
              mobile: mobileResult.categories["best-practices"].score,
              desktop: desktopResult.categories["best-practices"].score,
            },
            seo: {
              mobile: mobileResult.categories.seo.score,
              desktop: desktopResult.categories.seo.score,
            },
          },
        })

        console.log(`Audit for ${siteName} - ${url}:`)
        console.log(`Mobile Report: ${mobileReport}`)
        console.log(`Desktop Report: ${desktopReport}`)
      } catch (error) {
        console.error(`Error auditing ${siteName} - ${url}: ${error.message}`)
      }
    }
  }

  // Créer le fichier Excel avec les résultats d'audit
  await createExcelFile(auditResults)
}

main()
