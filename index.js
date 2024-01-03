import lighthouse from "lighthouse";
import { URL } from "url";
import puppeteer from "puppeteer";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

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
];

const carrefourSitesToAudit = [
  {
    name: "Carrefour Voyages FR",
    urls: [
      { linkGoTo: "https://voyages.carrefour.fr/", nameOfPage: "HP" },
      {
        linkGoTo:
          "https://voyages.carrefour.fr/serp?s_c.site=B2C&s_c.type_produit=sejour_etranger,sejour_france,circuits&s_c.destination=MCPI.ES",
        nameOfPage: "SERP",
      },
      // {
      //   linkGoTo:
      //     "https://voyages.carrefour.fr/sejour-etranger/djerba/hotel-vincci-safira-palms?pageType=product&s_pid=270110",
      //   nameOfPage: "FICHE PRODUIT",
      // },
      // {
      //   linkGoTo: "https://voyages.carrefour.fr/accueil/sejour-france",
      //   nameOfPage: "LANDING FR",
      // },
      // {
      //   linkGoTo: "https://voyages.carrefour.fr/accueil/derniere-minute/sejour",
      //   nameOfPage: "LANDING DM",
      // },
    ],
  },
  // {
  //   name: "Carrefour Voyages BE",
  //   urls: [
  //     { linkGoTo: "https://voyages.carrefour.be/", nameOfPage: "HP" },
  //     {
  //       linkGoTo:
  //         "https://voyages.carrefour.be/serp?s_c.site=B2C_BE&s_c.type_produit_be=voyage&s_c.destination=MCPI.ES",
  //       nameOfPage: "SERP",
  //     },
  //     {
  //       linkGoTo:
  //         "https://voyages.carrefour.be/voyage/djerba/hotel-vincci-safira-palms?pageType=product&s_pid=270110",
  //       nameOfPage: "FICHE PRODUIT",
  //     },
  //     {
  //       linkGoTo:
  //         "https://voyages.carrefour.be/home/camping/camping-sud-france",
  //       nameOfPage: "LANDING FR",
  //     },
  //     {
  //       linkGoTo: "https://voyages.carrefour.be/home/last-minute",
  //       nameOfPage: "LANDING DM",
  //     },
  //   ],
  // },
  // {
  //   name: "Carrefour Voyages NL",
  //   urls: [
  //     { linkGoTo: "https://reizen.carrefour.be/", nameOfPage: "HP" },
  //     {
  //       linkGoTo:
  //         "https://reizen.carrefour.be/serp?s_c.site=B2C_BE&s_c.type_produit_nl=wereldreis&s_c.destination=MCPI.ES",
  //       nameOfPage: "SERP",
  //     },
  //     {
  //       linkGoTo:
  //         "https://reizen.carrefour.be/wereldreis/djerba/hotel-cesar-thalasso?pageType=product&s_pid=237105",
  //       nameOfPage: "FICHE PRODUIT",
  //     },
  //     {
  //       linkGoTo: "https://reizen.carrefour.be/home/camping/zuid-frankrijk",
  //       nameOfPage: "LANDING FR",
  //     },
  //     {
  //       linkGoTo: "https://reizen.carrefour.be/home/last-minute",
  //       nameOfPage: "LANDING DM",
  //     },
  //   ],
  // },
];

async function runLighthouse(url, isMobile) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Définir l'émulation mobile si isMobile est true
  if (isMobile) {
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });
  }

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const lighthouseResult = await lighthouse(
    url,
    { port: new URL(browser.wsEndpoint()).port },
    null
  );

  await browser.close();

  return lighthouseResult.report;
}

async function createExcelFile(results) {
  const auditResultsFolder = "audit_results";
  const excelFilePath = path.join(
    auditResultsFolder,
    "lighthouse_results.xlsx"
  );

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Lighthouse Audit Results");

  // Ajouter une ligne d'en-tête
  worksheet.addRow([
    "Site",
    "URL",
    "Page Name",
    "Mobile Performance",
    "Desktop Performance",
    "Mobile Accessibility",
    "Desktop Accessibility",
    "Best Practices",
    "SEO",
  ]);

  // Ajouter les résultats pour chaque site et URL
  results.forEach((result) => {
    const { siteName, url, categories, pageName } = result;

    worksheet.addRow([
      siteName,
      url,
      pageName, // Ajouter cette ligne pour le nom de la page
      categories.performance.mobile * 100,
      categories.performance.desktop * 100,
      categories.accessibility.mobile * 100,
      categories.accessibility.desktop * 100,
      categories["best-practices"].mobile * 100,
      categories.seo.mobile * 100,
    ]);
  });

  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(auditResultsFolder)) {
    fs.mkdirSync(auditResultsFolder);
  }

  // Sauvegarder le fichier Excel
  await workbook.xlsx.writeFile(excelFilePath);

  console.log(`Excel file created: ${excelFilePath}`);
}

async function main() {
  const auditResults = [];

  for (const site of carrefourSitesToAudit) {
    const { name: siteName, urls } = site;

    for (const { linkGoTo, nameOfPage } of urls) {
      try {
        // Audit pour la version mobile
        const mobileReport = await runLighthouse(linkGoTo, true);
        const mobileResult = JSON.parse(mobileReport);

        // Audit pour la version desktop
        const desktopReport = await runLighthouse(linkGoTo, false);
        const desktopResult = JSON.parse(desktopReport);

        auditResults.push({
          siteName,
          url: linkGoTo,
          pageName: nameOfPage, // Ajout du nom de la page
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
            },
            seo: {
              mobile: mobileResult.categories.seo.score,
            },
          },
        });

        console.log(`Audit for ${siteName} - ${linkGoTo} (${nameOfPage}):`);
        console.log(`Mobile Report: ${mobileReport}`);
        console.log(`Desktop Report: ${desktopReport}`);
      } catch (error) {
        console.error(
          `Error auditing ${siteName} - ${linkGoTo} (${nameOfPage}): ${error.message}`
        );
      }
    }
  }

  // Créer le fichier Excel avec les résultats d'audit
  await createExcelFile(auditResults);
}

main();
