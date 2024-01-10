#!/usr/bin/env node
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/helpers.ts
var toPascalCase, toCamelCase, toKebabCase;
var init_helpers = __esm({
  "src/helpers.ts"() {
    "use strict";
    toPascalCase = (sliceName) => {
      const arr = sliceName.split("-");
      let result = "";
      arr.forEach((el) => {
        result += el.charAt(0).toUpperCase() + el.slice(1);
      });
      return result;
    };
    toCamelCase = (kebabCaseString) => {
      return kebabCaseString.replace(
        /-([a-z])/g,
        (_, letter) => letter.toUpperCase()
      );
    };
    toKebabCase = (inputString) => {
      return inputString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    };
  }
});

// src/templates.ts
var pageTemplate, uiTemplate, apiTemplate, typeTemplate, sliceTemplate;
var init_templates = __esm({
  "src/templates.ts"() {
    "use strict";
    init_helpers();
    pageTemplate = (sliceName) => {
      return `
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

export default ${toPascalCase(sliceName)}Index;`;
    };
    uiTemplate = (sliceName) => {
      return `
  export const ${toPascalCase(sliceName)} = () => {
      // return <div>${toPascalCase(sliceName)}</div>;
  };`;
    };
    apiTemplate = (sliceName) => {
      return `
    import { apiClient } from '@services';
    export const get${toPascalCase(
        sliceName
      )}Request= (params:unkown) => apiClient.client.get('/${sliceName}',params);
    export const post${toPascalCase(
        sliceName
      )}Request= params => apiClient.client.post('/${sliceName}',params);
    export const update${toPascalCase(
        sliceName
      )}Request= params => apiClient.client.put('/${sliceName}',params);
    export const delete${toPascalCase(
        sliceName
      )}Request= params => apiClient.client.delete('/${sliceName}',params);
  `;
    };
    typeTemplate = (sliceName) => {
      return `
import { TPagination } from '@types';

export type T${toPascalCase(sliceName)}Response = {
  ${toCamelCase(sliceName)}: T${toPascalCase(sliceName)};
  ${toCamelCase(sliceName)}Limit: number;
  ${toCamelCase(sliceName)}Access: boolean;
  attemptsGet${toPascalCase(sliceName)}PerYear: number;
};
export type T${toPascalCase(sliceName)}RecordStatus = {
  name: string;
  label: string;
  class: string;
};

export type T${toPascalCase(sliceName)}Record = {
  id: number;
  userId: number;
  size: string;
  offeredAt: string;
  status: T${toPascalCase(sliceName)}RecordStatus;
  denied: boolean | null;
};

export type T${toPascalCase(sliceName)} = {
  data: T${toPascalCase(sliceName)}Record[];
  pagination: TPagination;
};
`;
    };
    sliceTemplate = (sliceName, layer = null) => {
      if (layer === null)
        return uiTemplate(sliceName);
      let result = "";
      switch (layer) {
        case "ui":
          result = uiTemplate(sliceName);
          break;
        case "api":
          result = apiTemplate(sliceName);
          break;
        case "types":
          result = typeTemplate(sliceName);
          break;
      }
      return result;
    };
  }
});

// src/index.ts
import fs from "node:fs";
import { join } from "node:path";
import process from "node:process";
var require_src = __commonJS({
  "src/index.ts"() {
    init_templates();
    init_helpers();
    var slices = {
      e: "entities",
      f: "features",
      w: "widgets",
      s: "shared",
      entity: "entities",
      feature: "features",
      widget: "widgets",
      shared: "shared"
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
        if (Object.values(slices).includes(flag) || Object.keys(slices).includes(flag)) {
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
      const slicePath = join(layerPath, ["ui", null].includes(layer) ? `index.tsx` : "index.ts");
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
        `Entity for '${toPascalCase(sliceName2)}' generated at ${slicePath}`
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
            sliceName2
          )} from './${toKebabCase(sliceName2)}';
`;
          const updatedContent = data.replace(
            /(import \* as [^;]+;)/,
            `$1
${dynamicImport}`
          );
          const dynamicExport = `, ${toCamelCase(sliceName2)}`;
          const updatedExports = updatedContent.replace(
            /export\s*\{([^}]+)\}\s*;/g,
            `export {$1${dynamicExport}};`
          );
          fs.writeFile(indexPath, updatedExports, "utf-8", (err2) => {
            if (err2) {
              console.error("Error writing to index.ts:", err2);
              return;
            }
            console.log(
              `Index file updated successfully for '${toCamelCase(sliceName2)}'.`
            );
          });
        });
      } else {
        const defaultContent = `import * as ${sliceName2} from './${toKebabCase(
          sliceName2
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
  }
});
export default require_src();
