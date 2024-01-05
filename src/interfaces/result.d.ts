type Result = {
  name: string
  date: string
  pagesAndResult: PageAndResultAssociate[]
}

type PageAndResultAssociate = {
  name: string
  result: {
    mobile: number
    desktop: number
  }
}
