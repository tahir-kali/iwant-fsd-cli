#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generatePage(sliceName) {
  const pageTemplate = `
import { PageLayout } from '@features/layouts';
import { HeaderWidget } from '@widgets/header';
import { TabPage } from '@ui';

const ${toPascalCase(sliceName)}Index = () => {
  const tabs = ['Tab1', 'Tab2', 'Tab3', 'Tab4'];

  return (
    <div className="h-full w-full">
      <HeaderWidget />
      <PageLayout>
         
          <div className="bg-white rounded-lg p-12">
            <TabPage
              tabs={tabs}
              components={[<div></div>,<div></div>,<div></div>,<div></div>]}
            />
          </div>
       
      </PageLayout>
    </div>
  );
};

  export default ${toPascalCase(sliceName)}Index;
  
  `;

  const pagePath = path.join('src', 'pages', sliceName, 'index.tsx');

  fs.mkdirSync(path.join('src', 'pages', sliceName), { recursive: true });
  fs.writeFileSync(pagePath, pageTemplate, 'utf-8');
  updateIndexFile('pages',toPascalCase(sliceName));
  console.log(`Page '${toPascalCase(sliceName)}' created at ${pagePath}`);
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
    export const ${toPascalCase(sliceName)} = ()=> {
      return <div> ${toPascalCase(sliceName)} entity</div>
    }
  `;

  const entityFilePath = path.join(entitiesPath, `index.tsx`);
  fs.writeFileSync(entityFilePath, entityTemplate, 'utf-8');
  updateIndexFile('entities',toPascalCase(sliceName));
  console.log(`Entity for '${toPascalCase(sliceName)}' generated at ${entityFilePath}`);
}

function generateFeature(sliceName) {
  const featuresPath = path.join('src', `features/${sliceName}`);
  fs.mkdirSync(featuresPath, { recursive: true });

  const featureTemplate = `
  export const ${toPascalCase(sliceName)} = ()=> {
    return <div> ${toPascalCase(sliceName)} feature</div>
  }
`;

  const featureFilePath = path.join(featuresPath, 'index.tsx');
  fs.writeFileSync(featureFilePath, featureTemplate, 'utf-8');
  updateIndexFile('features',toPascalCase(sliceName));
  console.log(`Entity for '${toPascalCase(sliceName)}' generated at ${featureFilePath}`);
}

function generateWidget(sliceName) {
  const widgetsPath = path.join('src', `widgets/${sliceName}`);
  fs.mkdirSync(widgetsPath, { recursive: true });

  const widgetTemplate = `
  export const ${toPascalCase(sliceName)} = ()=> {
    return <div> ${toPascalCase(sliceName)} widget</div>
  }
`;

  const widgetFilePath = path.join(widgetsPath, `index.tsx`);
  fs.writeFileSync(widgetFilePath, widgetTemplate, 'utf-8');
  updateIndexFile('widgets',toPascalCase(sliceName));
  console.log(`widget for '${toPascalCase(sliceName)}' generated at ${widgetFilePath}`);
}


const updateIndexFile=(path,sliceName)=> {
  const indexPath = `src/${path}/index.ts`; // Update the path to your actual index.ts file
  if (fs.existsSync(indexPath)) {
  // Read the content of the existing index.ts file
  fs.readFile(indexPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading index.ts:', err);
      return;
    }

    // Add the dynamic import statement
    const dynamicImport = `import * as ${toCamelCase(sliceName)} from './${toKebabCase(sliceName)}';\n`;
    const updatedContent = data.replace(/(import \* as [^;]+;)/, `$1\n${dynamicImport}`);

    // Add the dynamic export statement
    const dynamicExport = `, ${toCamelCase(sliceName)}`;
    const updatedExports = updatedContent.replace( /export\s*\{([^}]+)\}\s*;/g, `export {$1${dynamicExport}};`);


    // Write the updated content back to the index.ts file
    fs.writeFile(indexPath, updatedExports, 'utf-8', (err) => {
      if (err) {
        console.error('Error writing to index.ts:', err);
        return;
      }

      console.log(`Index file updated successfully for '${toCamelCase(sliceName)}'.`);
    });
});
  }else{
     // If the file or directory doesn't exist, generate default content
     const defaultContent = `import * as ${sliceName} from './${toKebabCase(sliceName)}';\n\nexport { ${sliceName} };`;

     // Write the default content to the index.ts file
     fs.writeFileSync(indexPath, defaultContent, 'utf-8');
 
     console.log(`Index file created successfully for '${sliceName}'.`);
  }

}
const toPascalCase = (sliceName)=>{
  const arr = sliceName.split('-');
  let result = "";
  arr.forEach(el=>{
    result+=el.charAt(0).toUpperCase() + el.slice(1)
  })
  return result;
}
const toCamelCase=(kebabCaseString)=> {
  return kebabCaseString.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
const toKebabCase=(inputString)=> {
  return inputString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
// Usage example:
const what = process.argv[2]
const sliceName = process.argv[3];
const flags = process.argv.slice(3);
console.log(flags);
if (!sliceName) {
  console.error('Please provide a page name.');
  process.exit(1);
}

generatePage(sliceName);
generateFiles(sliceName, flags);

