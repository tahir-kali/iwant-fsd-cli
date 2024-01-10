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
  if(sliceExists(pagePath)){
    return;
  }
  fs.mkdirSync(path.join('src', 'pages', sliceName), { recursive: true });
  fs.writeFileSync(pagePath, pageTemplate, 'utf-8');
  updateIndexFile('pages',toPascalCase(sliceName));
  console.log(`Page '${toPascalCase(sliceName)}' created at ${pagePath}`);
}

function generateSegments(sliceName, segments,arguments=null) {
  segments[0].split(',').forEach(flag=>{
    const slices = {
      'e':'entities',
      'f':'features',
      'w':'widgets',
      's':'shared',
      'entity':'entities',
      'feature':'features',
      'widget':'widgets',
      'shared':'shared'
    }
   if(Object.values(slices).includes(flag) || Object.keys(slices).includes(flag)){
    createSegment(slices[flag],sliceName,arguments)
   }
})
  console.log(`Files for '${sliceName}' generated successfully.`);
}

function createSegment(slice,sliceName,arguments) {
  const layerPath = path.join('src', `${slice}/${sliceName}`);
  fs.mkdirSync(layerPath, { recursive: true });

  const entityTemplate = `
  export const ${toPascalCase(sliceName)} = ()=> {
      return <div> ${toPascalCase(sliceName)} entity</div>
  }
  `;

  const slicePath = path.join(layerPath, `index.tsx`);
  if(sliceExists(slicePath)){
    return;
  }
  fs.writeFileSync(slicePath, entityTemplate, 'utf-8');
  updateIndexFile(slice,toPascalCase(sliceName));

  if(arguments && arguments.length && arguments.includes('-s')){
    console.log('has other segments: '+arguments[arguments.length-1]);
  }

  console.log(`Entity for '${toPascalCase(sliceName)}' generated at ${slicePath}`);
}

const sliceExists=(path)=>{
  if(fs.existsSync(path)){
    return true;
  }
  return false;
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
const arguments = process.argv;
const segments = process.argv.slice(5);

if (!sliceName) {
  console.error('Please provide a name for the slice.');
  process.exit(1);
}

if(what==="page"){
  generatePage(sliceName);
  if(arguments.length && arguments.includes('-s') && segments.length) {
    console.log('Running this part '+segments);
    generateSegments(sliceName, segments);
  }
}else{
  generateSegments(sliceName,what,arguments);
}

