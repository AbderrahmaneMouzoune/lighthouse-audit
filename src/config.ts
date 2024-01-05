import { join } from 'path'

// Website to audit
export const siteToAudit = [
  {
    url: 'https://abderrahmanemouzoune.com',
    name: 'Abderrahmane Mouzoune | Portfolio',
    pages: [
      {
        url: 'https://abderrahmanemouzoune.com',
        name: 'Homepage'
      },
      {
        url: 'https://abderrahmanemouzoune.com/projects',
        name: 'Projects page'
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
