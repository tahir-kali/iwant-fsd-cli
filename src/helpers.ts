import { fsdRoot, slices } from "./constants";
import fs from "node:fs";
export const toPascalCase = (sliceName: string) => {
  const arr = sliceName.split("-");
  let result = "";
  arr.forEach((el) => {
    result += el.charAt(0).toUpperCase() + el.slice(1);
  });
  return result;
};
export const toCamelCase = (kebabCaseString: string) => {
  return kebabCaseString.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase(),
  );
};
export const toKebabCase = (inputString: string) => {
  return inputString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};
export const sliceExists = (path: string) => {
  return fs.existsSync(path);
};

export const deleteAll = () => {
  const layers = Object.values(slices);
  layers.forEach((layer) => {
    const path = `${fsdRoot}/${layer}`;
    if (sliceExists(path)) {
      console.log(`Deleting: ${path}`);
      fs.rmSync(path, { recursive: true });
    }
  });
};
