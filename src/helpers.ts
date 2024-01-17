import { slices } from "./constants";
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
export const sliceExists = async (path: string) => {
  try {
    await fs.access(path, undefined, () => true);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteAll = () => {
  const layers = Object.values(slices);
  layers.forEach(async (layer) => {
    if (await sliceExists(layer)) {
      console.log(`Exists Slice: ${layer}`);
    }
  });
};
