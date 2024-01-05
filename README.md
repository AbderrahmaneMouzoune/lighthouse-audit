# Lighthouse-audit [![Release](https://img.shields.io/github/v/release/AbderrahmaneMouzoune/lighthouse-audit)](https://github.com/AbderrahmaneMouzoune/lighthouse-audit/releases)

**Maintainer:** [Abderrahmane Mouzoune](https://github.com/AbderrahmaneMouzoune)

TABLE OF CONTENTS
-----------------

- [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
    - [Run the audit](#run-the-audit)
- [Contribute](#contribute)
- [Versions](#versions)
- [Acknowledgments](#acknowledgments)
- [Copyright](#copyright)

## Overview

Perform Lighthouse audits on websites using this simple Node.js project.

This project utilizes [Lighthouse](https://developers.google.com/web/tools/lighthouse) to perform audits on websites and generate insightful reports. The audit results include metrics related to performance, accessibility, best practices, SEO, and Progressive Web App (PWA) standards.

![Preview audit](https://github.com/AbderrahmaneMouzoune/lighthouse-audit/blob/master/assets/preview.png)

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [Google Chrome](https://www.google.com/chrome/) or [Chromium](https://www.chromium.org/)

### Installation

1. **Clone the repository :**

```bash
git clone https://github.com/AbderrahmaneMouzoune/lighthouse-audit
cd lighthouse-audit
```

2. **Install dependencies :**

```bash
npm install
```

### Configuration

To choose all the website and url to audit you need to change the `siteToAudit` constant on src/config.ts, respect the architecture to have no problem

```typescript
type WebSite = {
  name: string
  url: string
  pages: Page[]
}

type Page = {
  url: string
  name: string
}
```

### Usage

#### Run the audit

Execute the following command to run the Lighthouse audit :

```bash
npm run start
```

This command will generate an Excel file with the audit results in the `build` folder
-> To change the build folder you need to change `export const folderForGeneratedResults = 'audit_results'` on `src/config.ts` by the folder you want
-> To change the excel file name you need to change `export const filenameToGenerate = join(folderForGeneratedResults,'lighthouse_results.xlsx')` on `src/config.ts` by the file name you want

## Contribute

We welcome contributions for bug reports, issues, feature requests, feature implementations, and pull requests. Feel free to file a new issue 😃

For a complete guide on contributing to the plugin, see the [Contribution Guidelines](https://github.com/AbderrahmaneMouzoune/lighthouse-audit/blob/master/CONTRIBUTING.md).

## Versions

* If you want to see each release you can see that [here](https://github.com/AbderrahmaneMouzoune/lighthouse-audit/tags)

## Acknowledgments

* [Lighthouse](https://github.com/GoogleChrome/lighthouse) is an open-source, automated tool designed to improve web page quality.
* [ExcelJS](https://github.com/exceljs/exceljs) is a powerful library used for reading, manipulating, and writing Excel files.
* [Puppeteer](https://github.com/puppeteer/puppeteer) is a Node library that offers a high-level API for controlling headless browsers.

## Copyright

License MIT.

Thanks to :

* [Mehdi HATTOU](github.com/Teczer)
