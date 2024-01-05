import { join } from 'path'

// Website to audit
export const siteToAudit = [
  {
    url: 'https://abderrahmanemouzoune.com',
    name: 'Abderrahmane Mouzoune | Portfolio',
    pages: [
      {
        url: 'https://abderrahmanemouzoune.com',
        name: 'HP'
      }
      // {
      //   url: 'https://abderrahmanemouzoune.com/projects',
      //   name: 'SERP'
      // }
    ]
  }
]

// Folder Config
export const folderForGeneratedResults = 'audit_results'
export const filenameToGenerate = join(
  folderForGeneratedResults,
  'lighthouse_results.xlsx'
)
