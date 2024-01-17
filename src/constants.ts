import { detectFsdRoot } from "./detect-root";

export const what = process.argv[2];
export const sliceName = process.argv[3];
export const args = process.argv;
// export const segments = process.argv.slice(5);
export const slices: { [key: string]: string } = {
  e: "entities",
  f: "features",
  w: "widgets",
  s: "shared",
  entity: "entities",
  feature: "features",
  widget: "widgets",
  shared: "shared",
  p: "pages",
};
export const allowedSlices = [
  "ui",
  "api",
  "models",
  "stores",
  "utils",
  "assets",
  "constants",
  "services",
];

let fsdRoot = await detectFsdRoot();
if (Array.isArray(fsdRoot)) {
  fsdRoot = fsdRoot[0];
} else if (!fsdRoot.split("/").includes("src")) {
  fsdRoot = `${fsdRoot}/src`;
}
export { fsdRoot };
