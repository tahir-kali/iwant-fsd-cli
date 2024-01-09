#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generatePage(pageName) {
  const pageTemplate = `
    import React from 'react';

    const ${pageName} = () => {
      // Your page code here
      return (
        <div>
          <h1>${pageName} Page</h1>
        </div>
      );
    };

    export default ${pageName};
  `;

  const pagePath = path.join('src', 'pages', pageName, 'index.tsx');

  fs.mkdirSync(path.join('src', 'pages', pageName), { recursive: true });
  fs.writeFileSync(pagePath, pageTemplate, 'utf-8');

  console.log(`Page '${pageName}' created at ${pagePath}`);
}

function generateFiles(pageName, flags) {
  flags.forEach(arg => {
    arg.split(',').forEach(flag=>{
        console.log(flag);  
        switch (flag) {
            case 'e':
              generateEntity(pageName);
              break;
            case 'f':
              generateFeature(pageName);
              break;
            case 'w':
              generateWidget(pageName);
              break;
            // Add additional cases for other flags as needed
            // ...
          }
    })
  });

  console.log(`Files for '${pageName}' generated successfully.`);
}

function generateEntity(pageName) {
  const entitiesPath = path.join('src', 'entities');
  fs.mkdirSync(entitiesPath, { recursive: true });

  const entityTemplate = `
    export interface ${pageName}Entity {
      // Define your entity properties here
    }
  `;

  const entityFilePath = path.join(entitiesPath, `${pageName}Entity.ts`);
  fs.writeFileSync(entityFilePath, entityTemplate, 'utf-8');

  console.log(`Entity for '${pageName}' generated at ${entityFilePath}`);
}

function generateFeature(pageName) {
  const featuresPath = path.join('src', 'features');
  fs.mkdirSync(featuresPath, { recursive: true });

  const featureTemplate = `
    export interface ${pageName}feature {
      // Define your feature properties here
    }
  `;

  const featureFilePath = path.join(featuresPath, `${pageName}feature.ts`);
  fs.writeFileSync(featureFilePath, featureTemplate, 'utf-8');

  console.log(`Entity for '${pageName}' generated at ${featureFilePath}`);
}

function generateWidget(pageName) {
  const widgetsPath = path.join('src', 'widgets');
  fs.mkdirSync(widgetsPath, { recursive: true });

  const widgetTemplate = `
    export interface ${pageName}widget {
      // Define your widget properties here
    }
  `;

  const widgetFilePath = path.join(widgetsPath, `${pageName}widget.ts`);
  fs.writeFileSync(widgetFilePath, widgetTemplate, 'utf-8');

  console.log(`widget for '${pageName}' generated at ${widgetFilePath}`);
}

// Usage example:
const what = process.argv[2]
const pageName = process.argv[3];
console.log(what+"-------"+pageName);
const flags = process.argv.slice(3);

if (!pageName) {
  console.error('Please provide a page name.');
  process.exit(1);
}

generatePage(pageName);
generateFiles(pageName, flags);

