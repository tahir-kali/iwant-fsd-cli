import { toCamelCase, toKebabCase } from "./helpers";
import fs from "node:fs";

export const updateIndexFile = (
  path: string,
  sliceName: string,
  fsdRoot: string,
) => {
  let indexPath = "";
  if (path.toString().split("/").includes(`${fsdRoot}`)) {
    indexPath = `${path}/index.ts`; // Update the path to your actual index.ts file
  } else {
    indexPath = `src/${path}/index.ts`; // Update the path to your actual index.ts file
  }
  if (["pages", "ui"].includes(path)) {
    updateIfPagetOrSegment(indexPath, sliceName);
  }
};

const updateIfPagetOrSegment = (indexPath: string, sliceName: string) => {
  if (fs.existsSync(indexPath)) {
    // Read the content of the existing index.ts file
    fs.readFile(indexPath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading index.ts:", err);
        return;
      }
      // Add the dynamic import statement
      const dynamicImport = `import * as ${toCamelCase(
        sliceName,
      )} from './${toKebabCase(sliceName)}';\n`;
      const updatedContent = data.replace(
        /(import \* as [^;]+;)/,
        `$1\n${dynamicImport}`,
      );

      // Add the dynamic export statement
      const dynamicExport = `, ${toCamelCase(sliceName)}`;
      const updatedExports = updatedContent.replace(
        /export\s*\{([^}]+)\}\s*;/g,
        `export {$1${dynamicExport}};`,
      );

      // Write the updated content back to the index.ts file
      fs.writeFile(indexPath, updatedExports, "utf-8", (err) => {
        if (err) {
          console.error("Error writing to index.ts:", err);
          return;
        }

        console.log(
          `Index file updated successfully for '${toCamelCase(sliceName)}'.`,
        );
      });
    });
  } else {
    // If the file or directory doesn't exist, generate default content
    const defaultContent = `import * as ${sliceName} from './${toKebabCase(
      sliceName,
    )}';\n\nexport { ${sliceName} };`;

    // Write the default content to the index.ts file
    fs.writeFileSync(indexPath, defaultContent, "utf-8");

    console.log(`Index file created successfully for '${sliceName}'.`);
  }
};
