import { join } from "node:path";
import fs from "node:fs/promises";
import {
  apiTemplate,
  pageTemplate,
  typeTemplate,
  uiTemplate,
} from "./templates.js";
import { sliceExists, toKebabCase, toPascalCase } from "./helpers.js";

import { updateIndexFile } from "./update-imports.js";
import { allowedSlices, fsdRoot, sliceName, slices } from "./constants.js";

export const generateShared = async (args: string | string[] | null = null) => {
  const sharedPath = join(fsdRoot.toString(), "shared");
  if (!sliceExists(sharedPath)) {
    await fs.mkdir(sharedPath, { recursive: true });
  }
  if (!args?.length) return;
  const sharedIndex = args.indexOf("shared");
  const slicesType1 = allowedSlices.filter((slice) => slice !== "ui");
  console.log(`Args: ${JSON.stringify(args)}`);
  console.log(`SharedIndex: ${sharedIndex}`);
  if (args?.length && Array.isArray(args) && sharedIndex) {
    if (!allowedSlices.includes(args[sharedIndex + 1])) {
      args.forEach(async (arg) => {
        if (slicesType1.includes(arg)) {
          await generateSlice(sliceName, sharedPath, arg);
        } else {
          await generateUi(sliceName, sharedPath);
        }
      });
    } else {
      args.forEach(async (arg) => {
        const slicePath = `${sharedPath}/${arg}`;
        if (!sliceExists(slicePath) && allowedSlices.includes(arg)) {
          await fs.mkdir(slicePath, { recursive: true });
          await fs.writeFile(join(slicePath, "index.ts"), "");
        }
      });
    }
  }
};
export const generateEntity = async (
  sliceName: string,
  args: string | string[] | null = null,
) => {
  const entityPath = join(
    fsdRoot.toString(),
    "entities",
    toKebabCase(sliceName),
  );
  await fs.mkdir(entityPath, { recursive: true });
  if (Array.isArray(args) && args.includes("-s")) {
    const slicesType1 = allowedSlices.filter((slice) => slice !== "ui");
    console.log(`Args: ${JSON.stringify(args)}`);
    await Promise.all(
      args[args.length - 1].split(",").map(async (subfolder) => {
        if (allowedSlices.includes(subfolder)) {
          const subfolderPath = join(entityPath, subfolder);
          await fs.mkdir(subfolderPath);
          await fs.writeFile(join(subfolderPath, "index.ts"), "");
          if (slicesType1.includes(subfolder)) {
            await generateSlice(sliceName, entityPath, subfolder);
          } else {
            await generateUi(sliceName, entityPath);
          }
        }
      }),
    );
  }
  const indexPath = join(entityPath, "index.ts");
  const imports = (
    await Promise.all(
      ["ui", "api", "models", "stores"].map(async (subfolder) => {
        const subfolderPath = join(entityPath, subfolder);
        return await fs
          .access(subfolderPath)
          .then(() => `export * from './${subfolder}';`)
          .catch(() => "");
      }),
    )
  )
    .filter(Boolean)
    .join("\n");
  await fs.writeFile(indexPath, imports);
  updateIndexFile("entities", sliceName, fsdRoot.toString());
};

export const generateSlice = async (
  sliceName: string,
  path: string,
  type: string,
) => {
  const slicePath = join(path, type);
  if (!sliceExists(slicePath)) {
    await fs.mkdir(slicePath, { recursive: true });
  }
  const templates: { [key: string]: string } = {
    api: apiTemplate(sliceName),
    models: typeTemplate(sliceName),
  };
  const template = `${templates[type]}`;
  await fs.writeFile(join(slicePath, `${sliceName}.${type}.ts`), template);
  const indexPath = join(slicePath, "index.ts");
  const imports = await fs.readFile(indexPath, "utf-8").catch(() => "");
  const newIndexContent = `${imports}\nexport * from './${sliceName}.${type}';\n`;
  await fs.writeFile(indexPath, newIndexContent);
};

export const generateUi = async (sliceName: string, path: string) => {
  const uiFolderPath = join(path, "ui");
  const sliceFolderPath = join(uiFolderPath, sliceName);
  if (!sliceExists(uiFolderPath)) {
    await fs.mkdir(uiFolderPath, { recursive: true });
  }
  if (!sliceExists(sliceFolderPath)) {
    await fs.mkdir(sliceFolderPath, { recursive: true });
  }
  const template = uiTemplate(sliceName);
  await fs.writeFile(join(sliceFolderPath, "index.tsx"), template);
  const indexPath = join(uiFolderPath, "index.ts");
  const imports = await fs.readFile(indexPath, "utf-8").catch(() => "");
  const newIndexContent = `${imports}\nexport * from './${sliceName}';\n`;
  await fs.writeFile(indexPath, newIndexContent);
};

export const generateFeatureOrWidget = async (
  sliceName: string,
  what: string,
) => {
  const featureFolder = join(fsdRoot.toString(), slices[what]);
  const sliceFolderPath = join(featureFolder, sliceName);
  if (!sliceExists(featureFolder)) {
    await fs.mkdir(featureFolder, { recursive: true });
  }
  if (!sliceExists(sliceFolderPath)) {
    await fs.mkdir(sliceFolderPath, { recursive: true });
  }
  const template = uiTemplate(sliceName);
  await fs.writeFile(join(sliceFolderPath, "index.tsx"), template);
  updateIndexFile(slices[what], sliceName, fsdRoot.toString());
};

export const generatePage = async (sliceName: string) => {
  const pagePath = join(
    fsdRoot.toString(),
    "pages",
    toKebabCase(sliceName),
    "index.tsx",
  );
  if (sliceExists(pagePath)) {
    return;
  }
  await fs.mkdir(join(fsdRoot.toString(), "pages", sliceName), {
    recursive: true,
  });
  await fs.writeFile(pagePath, pageTemplate(sliceName), "utf-8");
  updateIndexFile("pages", `${toPascalCase(sliceName)}`, fsdRoot.toString());
  console.log(
    `Page '${toPascalCase(sliceName)}Index' generated at ${pagePath}`,
  );
};
