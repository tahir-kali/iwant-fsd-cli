import {
  apiTemplate,
  pageTemplate,
  typeTemplate,
  uiTemplate,
} from "./templates.js";
import { toKebabCase, toPascalCase } from "./helpers.js";
import { detectFsdRoot } from "./detect-root.js";
import fs from "node:fs";
import { join } from "node:path";
import { updateIndexFile } from "./update-imports.js";
import { slices } from "./constants.js";

let fsdRoot = await detectFsdRoot();
if (Array.isArray(fsdRoot)) {
  fsdRoot = fsdRoot[0];
} else if (!fsdRoot.split("/").includes("src")) {
  fsdRoot = `${fsdRoot}/src`;
}

export const createPage = () => {};
export const createEntity = (
  sliceName: string,
  args: string | string[] | undefined | null = null,
) => {
  const entityPath = join(`${fsdRoot}/entities`, toKebabCase(sliceName));
  fs.mkdirSync(entityPath, { recursive: true });

  if (Array.isArray(args) && args.includes("-s")) {
    const allowedSlices = ["ui", "api", "models", "stores"];
    const slicesType1 = allowedSlices.filter((slice) => slice !== "ui");
    console.log(`Args: ${JSON.stringify(args)}`);
    args[args.length - 1].split(",").forEach((subfolder) => {
      if (allowedSlices.includes(subfolder)) {
        const subfolderPath = join(entityPath, subfolder);
        fs.mkdirSync(subfolderPath);
        fs.writeFileSync(join(subfolderPath, "index.ts"), "");
        if (slicesType1.includes(subfolder)) {
          createSlice(sliceName, entityPath, subfolder);
        } else {
          createUi(sliceName, entityPath);
        }
      }
    });
  }

  const indexPath = join(entityPath, "index.ts");
  const imports = ["ui", "api", "models", "stores"].filter((subfolder) => {
    const subfolderPath = join(entityPath, subfolder);
    return fs.existsSync(subfolderPath);
  });

  fs.writeFileSync(
    indexPath,
    imports.map((subfolder) => `export * from './${subfolder}';`).join("\n"),
  );
};
export const createSlice = (sliceName: string, path: string, type: string) => {
  const slicePath = join(path, type);

  if (!fs.existsSync(slicePath)) {
    fs.mkdirSync(slicePath);
  }
  const templates: { [key: string]: string } = {
    api: apiTemplate(sliceName),
    models: typeTemplate(sliceName),
  };

  const template = `${templates[type]}`;
  fs.writeFileSync(join(slicePath, `${sliceName}.${type}.ts`), template);

  const indexPath = join(slicePath, "index.ts");
  const imports = fs.existsSync(indexPath)
    ? fs.readFileSync(indexPath, "utf-8")
    : "";
  const newIndexContent = `${imports}\nexport * from './${sliceName}.${type}';\n`;
  fs.writeFileSync(indexPath, newIndexContent);
};
export const createUi = (sliceName: string, path: string) => {
  const uiFolderPath = join(path, "ui");
  const sliceFolderPath = join(uiFolderPath, sliceName);

  if (!fs.existsSync(uiFolderPath)) {
    fs.mkdirSync(uiFolderPath);
  }
  fs.mkdirSync(sliceFolderPath);
  const template = uiTemplate(sliceName);
  fs.writeFileSync(join(sliceFolderPath, "index.tsx"), template);
  const indexPath = join(uiFolderPath, "index.ts");
  const imports = fs.existsSync(indexPath)
    ? fs.readFileSync(indexPath, "utf-8")
    : "";
  const newIndexContent = `${imports}\nexport * from './${sliceName}';\n`;
  fs.writeFileSync(indexPath, newIndexContent);
};
export const createFeatureOrWidget = (sliceName: string, what: string) => {
  // Create folder structure & feature,widget....
  const featureFolder = join(fsdRoot.toString(), slices[what]);
  const sliceFolderPath = join(featureFolder, sliceName);

  if (!fs.existsSync(featureFolder)) {
    fs.mkdirSync(featureFolder);
  }

  fs.mkdirSync(sliceFolderPath);
  const template = uiTemplate(sliceName);
  fs.writeFileSync(join(sliceFolderPath, "index.tsx"), template);
  updateIndexFile(featureFolder, sliceName, fsdRoot.toString());
};

export const generatePage = (sliceName: string) => {
  const pagePath = join(`${fsdRoot}`, "pages", sliceName, "index.tsx");
  if (sliceExists(pagePath)) {
    return;
  }
  fs.mkdirSync(join(`${fsdRoot}`, "pages", sliceName), { recursive: true });
  fs.writeFileSync(pagePath, pageTemplate(sliceName), "utf-8");
  updateIndexFile("pages", toPascalCase(sliceName), fsdRoot.toString());
  console.log(`Page '${toPascalCase(sliceName)}' created at ${pagePath}`);
};
const sliceExists = (path: string) => {
  if (fs.existsSync(path)) {
    return true;
  }
  return false;
};
