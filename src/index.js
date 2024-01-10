#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { sliceTemplate, pageTemplate } from './templates.js'
import { toPascalCase, toCamelCase, toKebabCase } from './helpers.js'
// All constants start

const slices = {
  e: 'entities',
  f: 'features',
  w: 'widgets',
  s: 'shared',
  entity: 'entities',
  feature: 'features',
  widget: 'widgets',
  shared: 'shared',
}

//  All constants end

// All functions start

const generatePage = (sliceName) => {
  const pagePath = path.join('src', 'pages', sliceName, 'index.tsx')
  if (sliceExists(pagePath)) {
    return
  }
  fs.mkdirSync(path.join('src', 'pages', sliceName), { recursive: true })
  fs.writeFileSync(pagePath, pageTemplate(sliceName), 'utf-8')
  updateIndexFile('pages', toPascalCase(sliceName))
  console.log(`Page '${toPascalCase(sliceName)}' created at ${pagePath}`)
}

const generateSegments = (sliceName, segments, args = null) => {
  segments[0].split(',').forEach((flag) => {
    if (
      Object.values(slices).includes(flag) ||
      Object.keys(slices).includes(flag)
    ) {
      createSegment(slices[flag], sliceName, null, args)
    }
  })
  console.log(`Files for '${sliceName}' generated successfully.`)
}

const createSegment = (slice, sliceName, layer, args) => {
  let layerPath = ''
  if (layer !== null) {
    layerPath = path.join(`${slice}/${sliceName}/${layer}`)
  } else {
    layerPath = path.join(`${slice}/${sliceName}`)
  }
  layerPath = path.join('src', layerPath)
  fs.mkdirSync(layerPath, { recursive: true })

  const slicePath = path.join(layerPath, `index.tsx`)

  if (sliceExists(slicePath)) {
    return
  }

  fs.writeFileSync(slicePath, sliceTemplate(sliceName), 'utf-8')

  if (layer === null) {
    updateIndexFile(`${slice}`, toPascalCase(sliceName))
  }

  if (args && args.length && args.includes('-s')) {
    args[args.length - 1].split(',').forEach((segment) => {
      createSegment(slice, sliceName, segment, null)
    })
  }

  console.log(
    `Entity for '${toPascalCase(sliceName)}' generated at ${slicePath}`
  )
}

const sliceExists = (path) => {
  if (fs.existsSync(path)) {
    return true
  }
  return false
}
const updateIndexFile = (path, sliceName) => {
  let indexPath = ''
  if (path.toString().split('/').includes('src')) {
    indexPath = `${path}/index.ts` // Update the path to your actual index.ts file
  } else {
    indexPath = `src/${path}/index.ts` // Update the path to your actual index.ts file
  }
  if (fs.existsSync(indexPath)) {
    // Read the content of the existing index.ts file
    fs.readFile(indexPath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading index.ts:', err)
        return
      }
      // Add the dynamic import statement
      const dynamicImport = `import * as ${toCamelCase(
        sliceName
      )} from './${toKebabCase(sliceName)}';\n`
      const updatedContent = data.replace(
        /(import \* as [^;]+;)/,
        `$1\n${dynamicImport}`
      )

      // Add the dynamic export statement
      const dynamicExport = `, ${toCamelCase(sliceName)}`
      const updatedExports = updatedContent.replace(
        /export\s*\{([^}]+)\}\s*;/g,
        `export {$1${dynamicExport}};`
      )

      // Write the updated content back to the index.ts file
      fs.writeFile(indexPath, updatedExports, 'utf-8', (err) => {
        if (err) {
          console.error('Error writing to index.ts:', err)
          return
        }

        console.log(
          `Index file updated successfully for '${toCamelCase(sliceName)}'.`
        )
      })
    })
  } else {
    // If the file or directory doesn't exist, generate default content
    const defaultContent = `import * as ${sliceName} from './${toKebabCase(
      sliceName
    )}';\n\nexport { ${sliceName} };`

    // Write the default content to the index.ts file
    fs.writeFileSync(indexPath, defaultContent, 'utf-8')

    console.log(`Index file created successfully for '${sliceName}'.`)
  }
}

// All functions end

// Usage

const what = process.argv[2]
const sliceName = process.argv[3]
const args = process.argv
const segments = process.argv.slice(5)

if (!sliceName) {
  console.error('Please provide a name for the slice.')
  process.exit(1)
}

if (what === 'page') {
  console.log(what)
  generatePage(sliceName)
  if (args.length && args.includes('-s') && segments.length) {
    generateSegments(sliceName, segments)
  }
} else {
  generateSegments(sliceName, what, args)
}
