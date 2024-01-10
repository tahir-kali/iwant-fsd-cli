#!/usr/bin/env node

// src/index.ts
import fs from "node:fs";
import { join } from "node:path";
import process from "node:process";

// src/helpers.ts
var toPascalCase = (sliceName2) => {
  const arr = sliceName2.split("-");
  let result = "";
  arr.forEach((el) => {
    result += el.charAt(0).toUpperCase() + el.slice(1);
  });
  return result;
};
var toCamelCase = (kebabCaseString) => {
  return kebabCaseString.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase(),
  );
};
var toKebabCase = (inputString) => {
  return inputString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

// src/templates.ts
var pageTemplate = (sliceName2) => {
  return `
import { PageLayout } from '@features/layouts';
import { HeaderWidget } from '@widgets/header';
import { TabPage } from '@ui';

const ${toPascalCase(sliceName2)}Index = () => {
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

export default ${toPascalCase(sliceName2)}Index;`;
};
var uiTemplate = (sliceName2) => {
  return `
  export const ${toPascalCase(sliceName2)} = () => {
      // return <div>${toPascalCase(sliceName2)}</div>;
  };`;
};
var apiTemplate = (sliceName2) => {
  return `
    import { apiClient } from '@services';
    export const get${toPascalCase(
      sliceName2,
    )}Request= (params:unkown) => apiClient.client.get('/${sliceName2}',params);
    export const post${toPascalCase(
      sliceName2,
    )}Request= params => apiClient.client.post('/${sliceName2}',params);
    export const update${toPascalCase(
      sliceName2,
    )}Request= params => apiClient.client.put('/${sliceName2}',params);
    export const delete${toPascalCase(
      sliceName2,
    )}Request= params => apiClient.client.delete('/${sliceName2}',params);
  `;
};
var typeTemplate = (sliceName2) => {
  return `
import { TPagination } from '@types';

export type T${toPascalCase(sliceName2)}Response = {
  ${toCamelCase(sliceName2)}: T${toPascalCase(sliceName2)};
  ${toCamelCase(sliceName2)}Limit: number;
  ${toCamelCase(sliceName2)}Access: boolean;
  attemptsGet${toPascalCase(sliceName2)}PerYear: number;
};
export type T${toPascalCase(sliceName2)}RecordStatus = {
  name: string;
  label: string;
  class: string;
};

export type T${toPascalCase(sliceName2)}Record = {
  id: number;
  userId: number;
  size: string;
  offeredAt: string;
  status: T${toPascalCase(sliceName2)}RecordStatus;
  denied: boolean | null;
};

export type T${toPascalCase(sliceName2)} = {
  data: T${toPascalCase(sliceName2)}Record[];
  pagination: TPagination;
};
`;
};
var sliceTemplate = (sliceName2, layer = null) => {
  if (layer === null) return uiTemplate(sliceName2);
  let result = "";
  switch (layer) {
    case "ui":
      result = uiTemplate(sliceName2);
      break;
    case "api":
      result = apiTemplate(sliceName2);
      break;
    case "types":
      result = typeTemplate(sliceName2);
      break;
  }
  return result;
};

// src/index.ts
var slices = {
  e: "entities",
  f: "features",
  w: "widgets",
  s: "shared",
  entity: "entities",
  feature: "features",
  widget: "widgets",
  shared: "shared",
};
var generatePage = (sliceName2) => {
  const pagePath = join("src", "pages", sliceName2, "index.tsx");
  if (sliceExists(pagePath)) {
    return;
  }
  fs.mkdirSync(join("src", "pages", sliceName2), { recursive: true });
  fs.writeFileSync(pagePath, pageTemplate(sliceName2), "utf-8");
  updateIndexFile("pages", toPascalCase(sliceName2));
  console.log(`Page '${toPascalCase(sliceName2)}' created at ${pagePath}`);
};
var generateSegments = (sliceName2, segments2, args2 = null) => {
  segments2[0].split(",").forEach((flag) => {
    if (
      Object.values(slices).includes(flag) ||
      Object.keys(slices).includes(flag)
    ) {
      createSegment(slices[flag], sliceName2, null, args2);
    }
  });
  console.log(`Files for '${sliceName2}' generated successfully.`);
};
var createSegment = (slice, sliceName2, layer, args2) => {
  let layerPath = "";
  if (layer !== null) {
    layerPath = join(`${slice}/${sliceName2}/${layer}`);
  } else {
    layerPath = join(`${slice}/${sliceName2}`);
  }
  layerPath = join("src", layerPath);
  fs.mkdirSync(layerPath, { recursive: true });
  const slicePath = join(
    layerPath,
    ["ui", null].includes(layer) ? `index.tsx` : "index.ts",
  );
  if (sliceExists(slicePath)) {
    return;
  }
  fs.writeFileSync(slicePath, sliceTemplate(sliceName2, layer), "utf-8");
  if (layer === null) {
    updateIndexFile(`${slice}`, toPascalCase(sliceName2));
  }
  if (args2 && args2.length && args2.includes("-s")) {
    args2[args2.length - 1].split(",").forEach((segment) => {
      createSegment(slice, sliceName2, segment, null);
    });
  }
  console.log(
    `Entity for '${toPascalCase(sliceName2)}' generated at ${slicePath}`,
  );
};
var sliceExists = (path) => {
  if (fs.existsSync(path)) {
    return true;
  }
  return false;
};
var updateIndexFile = (path, sliceName2) => {
  let indexPath = "";
  if (path.toString().split("/").includes("src")) {
    indexPath = `${path}/index.ts`;
  } else {
    indexPath = `src/${path}/index.ts`;
  }
  if (fs.existsSync(indexPath)) {
    fs.readFile(indexPath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading index.ts:", err);
        return;
      }
      const dynamicImport = `import * as ${toCamelCase(
        sliceName2,
      )} from './${toKebabCase(sliceName2)}';
`;
      const updatedContent = data.replace(
        /(import \* as [^;]+;)/,
        `$1
${dynamicImport}`,
      );
      const dynamicExport = `, ${toCamelCase(sliceName2)}`;
      const updatedExports = updatedContent.replace(
        /export\s*\{([^}]+)\}\s*;/g,
        `export {$1${dynamicExport}};`,
      );
      fs.writeFile(indexPath, updatedExports, "utf-8", (err2) => {
        if (err2) {
          console.error("Error writing to index.ts:", err2);
          return;
        }
        console.log(
          `Index file updated successfully for '${toCamelCase(sliceName2)}'.`,
        );
      });
    });
  } else {
    const defaultContent = `import * as ${sliceName2} from './${toKebabCase(
      sliceName2,
    )}';

export { ${sliceName2} };`;
    fs.writeFileSync(indexPath, defaultContent, "utf-8");
    console.log(`Index file created successfully for '${sliceName2}'.`);
  }
};
var what = process.argv[2];
var sliceName = process.argv[3];
var args = process.argv;
var segments = process.argv.slice(5);
if (!sliceName) {
  console.error("Please provide a name for the slice.");
  process.exit(1);
}
if (what === "page") {
  console.log(what);
  generatePage(sliceName);
  if (args.length && args.includes("-s") && segments.length) {
    generateSegments(sliceName, segments);
  }
} else {
  generateSegments(sliceName, [...what], args);
}
