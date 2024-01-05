const path = require('path')

// Website to audit
export const siteToAudit: WebSite[] = [
  {
    url: 'https://abderrahmanemouzoune.com',
    name: 'Abderrahmane Mouzoune | Portfolio',
    pages: [
      {
        url: 'https://abderrahmanemouzoune.com',
        name: 'HP'
      },
      {
        url: 'https://abderrahmanemouzoune.com/projects',
        name: 'SERP'
      }
    ]
  }
]

// Folder Config
export const folderForGeneratedResults = 'audit_results'

export const filenameToGenerate = path.join(
  folderForGeneratedResults,
  'lighthouse_results.xlsx'
)

module.exports = { siteToAudit, folderForGeneratedResults, filenameToGenerate }
