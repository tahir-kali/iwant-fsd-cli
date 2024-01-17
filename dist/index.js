#!/usr/bin/env node

// src/index.ts
import process2 from "node:process";

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
    )}Request= (params:unknown) => apiClient.client.get('/${sliceName2}',{params});
    export const post${toPascalCase(
      sliceName2,
    )}Request= (params:unknown) => apiClient.client.post('/${sliceName2}',params);
    export const update${toPascalCase(
      sliceName2,
    )}Request= (params:unknown) => apiClient.client.put('/${sliceName2}',params);
    export const delete${toPascalCase(
      sliceName2,
    )}Request= (params:unknown) => apiClient.client.delete('/${sliceName2}',params);
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

// src/detect-root.ts
import * as fs from "fs/promises";
import * as path from "path";
import simpleGit from "simple-git";
var layers = ["app", "pages", "widgets", "features", "entities", "shared"];
var defaultIgnoredFolders = ["node_modules", ".git", "dist", "build"];
async function getLayersCountInFolder(folderPath) {
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  return files
    .filter((file) => file.isDirectory())
    .map((file) => path.join(folderPath, file.name))
    .filter((file) => layers.includes(path.basename(file))).length;
}
async function filterIgnoredFolders(folders) {
  if (folders.length === 0) {
    return [];
  }
  const git = simpleGit();
  const ignoredByGit = (await git.checkIgnore(folders)).map((folder) =>
    path.normalize(folder.slice(1, -1)),
  );
  const filteredByGit = folders.filter(
    (folder) => !ignoredByGit.includes(folder),
  );
  const filteredByDefaults = filteredByGit.filter(
    (folder) => !defaultIgnoredFolders.includes(path.basename(folder)),
  );
  return filteredByDefaults;
}
async function detectFsdRoot() {
  const cwd = path.resolve(process.cwd());
  const cwdLayersCount = await getLayersCountInFolder(cwd);
  if (cwdLayersCount >= 2) {
    return cwd;
  }
  const git = simpleGit();
  const isGitRepo = await git.checkIsRepo();
  const queue = [cwd];
  let maxLayersCount = 0;
  let foldersWithMaxLayers = [];
  while (queue.length > 0) {
    const currentDirectory = queue.shift();
    const directoryContent = await fs.readdir(currentDirectory, {
      withFileTypes: true,
    });
    const directories = directoryContent
      .filter((item) => item.isDirectory())
      .map((item) => path.join(currentDirectory, item.name));
    const filteredDirectories = isGitRepo
      ? await filterIgnoredFolders(directories)
      : directories.filter(
          (item) => !defaultIgnoredFolders.includes(path.basename(item)),
        );
    let layerCount = 0;
    for (const item of filteredDirectories) {
      queue.push(item);
      if (layers.includes(path.basename(item))) {
        layerCount++;
      }
    }
    if (layerCount > maxLayersCount) {
      maxLayersCount = layerCount;
      foldersWithMaxLayers = [currentDirectory];
    } else if (layerCount === maxLayersCount) {
      foldersWithMaxLayers.push(currentDirectory);
    }
  }
  if (maxLayersCount === 0) {
    return cwd;
  }
  if (foldersWithMaxLayers.length === 1) {
    return foldersWithMaxLayers[0];
  }
  return foldersWithMaxLayers;
}

// src/generators.ts
import fs3 from "node:fs";
import { join as join2 } from "node:path";

// src/update-imports.ts
import fs2 from "node:fs";
var updateIndexFile = (path2, sliceName2, fsdRoot2) => {
  let indexPath = "";
  if (path2.toString().split("/").includes(`${fsdRoot2}`)) {
    indexPath = `${path2}/index.ts`;
  } else {
    indexPath = `src/${path2}/index.ts`;
  }
  updateIfPagetOrSegment(indexPath, sliceName2);
};
var updateIfPagetOrSegment = (indexPath, sliceName2) => {
  if (fs2.existsSync(indexPath)) {
    fs2.readFile(indexPath, "utf-8", (err, data) => {
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
      fs2.writeFile(indexPath, updatedExports, "utf-8", (err2) => {
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
    fs2.writeFileSync(indexPath, defaultContent, "utf-8");
    console.log(`Index file created successfully for '${sliceName2}'.`);
  }
};

// src/constants.ts
var what = process.argv[2];
var sliceName = process.argv[3];
var args = process.argv;
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

// src/generators.ts
var fsdRoot = await detectFsdRoot();
if (Array.isArray(fsdRoot)) {
  fsdRoot = fsdRoot[0];
} else if (!fsdRoot.split("/").includes("src")) {
  fsdRoot = `${fsdRoot}/src`;
}
var createEntity = (sliceName2, args2 = null) => {
  const entityPath = join2(`${fsdRoot}/entities`, toKebabCase(sliceName2));
  fs3.mkdirSync(entityPath, { recursive: true });
  if (Array.isArray(args2) && args2.includes("-s")) {
    const allowedSlices = ["ui", "api", "models", "stores"];
    const slicesType1 = allowedSlices.filter((slice) => slice !== "ui");
    console.log(`Args: ${JSON.stringify(args2)}`);
    args2[args2.length - 1].split(",").forEach((subfolder) => {
      if (allowedSlices.includes(subfolder)) {
        const subfolderPath = join2(entityPath, subfolder);
        fs3.mkdirSync(subfolderPath);
        fs3.writeFileSync(join2(subfolderPath, "index.ts"), "");
        if (slicesType1.includes(subfolder)) {
          createSlice(sliceName2, entityPath, subfolder);
        } else {
          createUi(sliceName2, entityPath);
        }
      }
    });
  }
  const indexPath = join2(entityPath, "index.ts");
  const imports = ["ui", "api", "models", "stores"].filter((subfolder) => {
    const subfolderPath = join2(entityPath, subfolder);
    return fs3.existsSync(subfolderPath);
  });
  fs3.writeFileSync(
    indexPath,
    imports.map((subfolder) => `export * from './${subfolder}';`).join("\n"),
  );
};
var createSlice = (sliceName2, path2, type) => {
  const slicePath = join2(path2, type);
  if (!fs3.existsSync(slicePath)) {
    fs3.mkdirSync(slicePath);
  }
  const templates = {
    api: apiTemplate(sliceName2),
    models: typeTemplate(sliceName2),
  };
  const template = `${templates[type]}`;
  fs3.writeFileSync(join2(slicePath, `${sliceName2}.${type}.ts`), template);
  const indexPath = join2(slicePath, "index.ts");
  const imports = fs3.existsSync(indexPath)
    ? fs3.readFileSync(indexPath, "utf-8")
    : "";
  const newIndexContent = `${imports}
export * from './${sliceName2}.${type}';
`;
  fs3.writeFileSync(indexPath, newIndexContent);
};
var createUi = (sliceName2, path2) => {
  const uiFolderPath = join2(path2, "ui");
  const sliceFolderPath = join2(uiFolderPath, sliceName2);
  if (!fs3.existsSync(uiFolderPath)) {
    fs3.mkdirSync(uiFolderPath);
  }
  fs3.mkdirSync(sliceFolderPath);
  const template = uiTemplate(sliceName2);
  fs3.writeFileSync(join2(sliceFolderPath, "index.tsx"), template);
  const indexPath = join2(uiFolderPath, "index.ts");
  const imports = fs3.existsSync(indexPath)
    ? fs3.readFileSync(indexPath, "utf-8")
    : "";
  const newIndexContent = `${imports}
export * from './${sliceName2}';
`;
  fs3.writeFileSync(indexPath, newIndexContent);
};
var createFeatureOrWidget = (sliceName2, what2) => {
  const featureFolder = join2(fsdRoot.toString(), slices[what2]);
  const sliceFolderPath = join2(featureFolder, sliceName2);
  if (!fs3.existsSync(featureFolder)) {
    fs3.mkdirSync(featureFolder);
  }
  fs3.mkdirSync(sliceFolderPath);
  const template = uiTemplate(sliceName2);
  fs3.writeFileSync(join2(sliceFolderPath, "index.tsx"), template);
  updateIndexFile(featureFolder, sliceName2, fsdRoot.toString());
};
var generatePage = (sliceName2) => {
  const pagePath = join2(`${fsdRoot}`, "pages", sliceName2, "index.tsx");
  if (sliceExists(pagePath)) {
    return;
  }
  fs3.mkdirSync(join2(`${fsdRoot}`, "pages", sliceName2), { recursive: true });
  fs3.writeFileSync(pagePath, pageTemplate(sliceName2), "utf-8");
  updateIndexFile("pages", toPascalCase(sliceName2), fsdRoot.toString());
  console.log(`Page '${toPascalCase(sliceName2)}' created at ${pagePath}`);
};
var sliceExists = (path2) => {
  if (fs3.existsSync(path2)) {
    return true;
  }
  return false;
};

// src/index.ts
if (!what) process2.exit(1);
if (!sliceName) {
  console.error("Please provide a name for the slice.");
  process2.exit(1);
}
if (what === "page") generatePage(sliceName);
else if (what === "entity") createEntity(sliceName, args);
else if (["feature", "widget"].includes(what))
  createFeatureOrWidget(sliceName, what);
