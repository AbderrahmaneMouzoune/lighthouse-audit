import { join } from 'path'

// Website to audit
// export const siteToAudit = [
//   {
//     url: 'https://abderrahmanemouzoune.com',
//     name: 'Abderrahmane Mouzoune | Portfolio',
//     pages: [
//       {
//         url: 'https://abderrahmanemouzoune.com',
//         name: 'HP'
//       }
//       // {
//       //   url: 'https://abderrahmanemouzoune.com/projects',
//       //   name: 'SERP'
//       // }
//     ]
//   }
// ]

export const siteToAudit = [
  {
    url: 'https://voyages.carrefour.fr',
    name: 'Carrefour Voyages',
    pages: [
      {
        url: 'https://voyages.carrefour.fr/',
        name: 'HP'
      },
      {
        url: 'https://voyages.carrefour.fr/serp?s_c.site=B2C&s_c.type_produit=sejour_etranger,sejour_france,circuits&s_c.destination=MCPI.ES',
        name: 'SERP'
      },
      {
        url: 'https://voyages.carrefour.fr/sejour-etranger/djerba/hotel-vincci-safira-palms?pageType=product&s_pid=270110',
        name: 'FICHE PRODUIT'
      },
      {
        url: 'https://voyages.carrefour.fr/accueil/sejour-france',
        name: 'LANDING FR'
      },
      {
        url: 'https://voyages.carrefour.fr/accueil/derniere-minute/sejour',
        name: 'LANDING DM'
      }
    ]
  }
]

// Parallel audit
export const maxParrallelAuditAtTheSametime = 1

// Folder Config
export const folderForGeneratedResults = 'audit_results'
export const filenameToGenerate = join(
  folderForGeneratedResults,
  'lighthouse_results.xlsx'
)
