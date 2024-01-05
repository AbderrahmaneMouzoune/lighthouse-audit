import { filenameToGenerate } from './config.js'

export function makeExcel(results: Result[]) {
  const ExcelJS = require('exceljs')

  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook()

  // For each result of site we create a differente sheet & put data
  for (const resultOfSite of results) {
    const worksheet = workbook.addWorksheet(resultOfSite.name)

    // pages name is 2 col cause col 1 = mobile col 2 = desktop
    const pagesName = resultOfSite.pagesAndResult
      .map((page) => [page.name, ''])
      .flat()

    const numberOfMobAndDesk = resultOfSite.pagesAndResult
      .map(() => ['Mob', 'Desk'])
      .flat()

    const headers = [resultOfSite.name, ...pagesName, 'Total']
    // Add one last Mob & Desk for Total
    const subHeaders = ['Date / Device', ...numberOfMobAndDesk, 'Mob', 'Desk']

    worksheet.addRow(headers)
    worksheet.addRow(subHeaders)

    // Dynamically merge cells for all headers spanning 2 columns
    headers.forEach((header, index) => {
      const startColumn = index * 2 + 2
      const endColumn = startColumn + 1
      worksheet.mergeCells(1, startColumn, 1, endColumn)
    })

    const scores = resultOfSite.pagesAndResult
      .map((page) => [page.result.mobile, page.result.desktop])
      .flat()

    const doTheAverageTotalScore = (scores: number[]): number =>
      scores.reduce((acc, curr) => acc + curr, 0) / scores.length

    // Add data rows
    const dataRows = [
      [
        resultOfSite.date,
        ...scores,
        doTheAverageTotalScore(
          resultOfSite.pagesAndResult.map((page) => page.result.mobile)
        ),
        doTheAverageTotalScore(
          resultOfSite.pagesAndResult.map((page) => page.result.desktop)
        )
      ]
    ]

    dataRows.forEach((row) => worksheet.addRow(row))
  }

  // Save the workbook to a file
  workbook.xlsx
    .writeFile(filenameToGenerate)
    .then(() => {
      console.log('Excel file created successfully!')
    })
    .catch((err: any) => {
      console.error('Error creating Excel file:', err)
    })
}
