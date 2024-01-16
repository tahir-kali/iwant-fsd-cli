import { sliceTemplate, pageTemplate } from "./templates.js";
import { toPascalCase } from "./helpers.js";
import { detectFsdRoot } from "./detect-root.js";
import fs from "node:fs";
import { join } from "node:path";
import { updateIndexFile } from "./update-imports.js";
const slices: { [key: string]: string } = {
  e: "entities",
  f: "features",
  w: "widgets",
  s: "shared",
  entity: "entities",
  feature: "features",
  widget: "widgets",
  shared: "shared",
};

let fsdRoot = await detectFsdRoot();
if (Array.isArray(fsdRoot)) {
  fsdRoot = fsdRoot[0];
} else if (!fsdRoot.split("/").includes("src")) {
  fsdRoot = `${fsdRoot}/src`;
}
export const generatePage = (sliceName: string) => {
  console.log(`Root: ${fsdRoot}`);
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
export const generateSegments = (
  sliceName: string,
  segments: string[],
  args: string[] | null = null,
) => {
  segments[0].split(",").forEach((flag: string) => {
    if (
      Object.values(slices).includes(flag) ||
      Object.keys(slices).includes(flag)
    ) {
      createSegment(slices[flag], sliceName, null, args);
    }
  });
  console.log(`Files for '${sliceName}' generated successfully.`);
};
const createSegment = (
  slice: string,
  sliceName: string,
  layer: string | null,
  args: string[] | null = null,
) => {
  let layerPath = "";
  if (layer !== null) {
    layerPath = join(`${slice}/${sliceName}/${layer}`);
  } else {
    layerPath = join(`${slice}/${sliceName}`);
  }
  layerPath = join(`${fsdRoot}`, layerPath);
  fs.mkdirSync(layerPath, { recursive: true });

  const slicePath = join(
    layerPath,
    ["ui", null].includes(layer) ? `index.tsx` : "index.ts",
  );

  if (sliceExists(slicePath)) {
    return;
  }

  fs.writeFileSync(slicePath, sliceTemplate(sliceName, layer), "utf-8");

  if (layer === null) {
    updateIndexFile(`${slice}`, toPascalCase(sliceName), fsdRoot.toString());
  }

  if (args && args.length && args.includes("-s")) {
    args[args.length - 1].split(",").forEach((segment) => {
      createSegment(slice, sliceName, segment, null);
    });
  }

  console.log(
    `Entity for '${toPascalCase(sliceName)}' generated at ${slicePath}`,
  );
};
