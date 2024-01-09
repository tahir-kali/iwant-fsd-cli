#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generatePage(sliceName) {
  const pageTemplate = `
    import React from 'react';

    const ${sliceName} = () => {
      // Your page code here
      return (
        <div>
          <h1>${sliceName} Page</h1>
        </div>
      );
    };

    export default ${sliceName};
  `;

  const pagePath = path.join('src', 'pages', sliceName, 'index.tsx');

  fs.mkdirSync(path.join('src', 'pages', sliceName), { recursive: true });
  fs.writeFileSync(pagePath, pageTemplate, 'utf-8');

  console.log(`Page '${sliceName}' created at ${pagePath}`);
}

function generateFiles(sliceName, flags) {
  flags.forEach(arg => {
    arg.split(',').forEach(flag=>{
        console.log(flag);  
        switch (flag) {
            case 'e':
              generateEntity(sliceName);
              break;
            case 'f':
              generateFeature(sliceName);
              break;
            case 'w':
              generateWidget(sliceName);
              break;
            // Add additional cases for other flags as needed
            // ...
          }
    })
  });

  console.log(`Files for '${sliceName}' generated successfully.`);
}

function generateEntity(sliceName) {
  const entitiesPath = path.join('src', `entities/${sliceName}`);
  fs.mkdirSync(entitiesPath, { recursive: true });

  const entityTemplate = `
    export const ${sliceName} = ()=> {
      return <div> ${sliceName} entity</div>
    }
  `;

  const entityFilePath = path.join(entitiesPath, `index.tsx`);
  fs.writeFileSync(entityFilePath, entityTemplate, 'utf-8');

  console.log(`Entity for '${sliceName}' generated at ${entityFilePath}`);
}

function generateFeature(sliceName) {
  const featuresPath = path.join('src', `features/${sliceName}`);
  fs.mkdirSync(featuresPath, { recursive: true });

  const featureTemplate = `
  export const ${sliceName} = ()=> {
    return <div> ${sliceName} feature</div>
  }
`;

  const featureFilePath = path.join(featuresPath, 'index.tsx');
  fs.writeFileSync(featureFilePath, featureTemplate, 'utf-8');

  console.log(`Entity for '${sliceName}' generated at ${featureFilePath}`);
}

function generateWidget(sliceName) {
  const widgetsPath = path.join('src', `widgets/${sliceName}`);
  fs.mkdirSync(widgetsPath, { recursive: true });

  const widgetTemplate = `
  export const ${sliceName} = ()=> {
    return <div> ${sliceName} widget</div>
  }
`;

  const widgetFilePath = path.join(widgetsPath, `index.tsx`);
  fs.writeFileSync(widgetFilePath, widgetTemplate, 'utf-8');

  console.log(`widget for '${sliceName}' generated at ${widgetFilePath}`);
}

// Usage example:
const what = process.argv[2]
const sliceName = process.argv[3];
const flags = process.argv.slice(3);

if (!sliceName) {
  console.error('Please provide a page name.');
  process.exit(1);
}

generatePage(sliceName);
generateFiles(sliceName, flags);

