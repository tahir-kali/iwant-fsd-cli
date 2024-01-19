import { toPascalCase, toKebabCase } from "./helpers";
import fs from "node:fs";
import { extname } from "node:path";
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
  let append = "";
  if (path === "pages") append = "Index";
  updateIfPagetOrSegment(indexPath, sliceName, append);
};

const updateIfPagetOrSegment = (
  indexPath: string,
  sliceName: string,
  append: string = "",
) => {
  console.log(`Updating IndexPath: ${indexPath}`);
  if (fs.existsSync(indexPath)) {
    // Read the content of the existing index.ts file
    fs.readFile(indexPath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading index.ts:", err);
        return;
      }
      // Add the dynamic import statement
      const dynamicImport = `import ${toPascalCase(sliceName)}${append} from './${toKebabCase(sliceName)}';\n`;
      const updatedContent = data.replace(
        /(import \* as [^;]+;)/,
        `$1\n${dynamicImport}`,
      );

      // Add the dynamic export statement
      const dynamicExport = `, ${toPascalCase(sliceName)}${append}`;
      const updatedExports = updatedContent.replace(
        /export\s*\{([^}]+)\}\s*;/g,
        `export {$1${dynamicExport}};`,
      );

      // Write the updated content back to the index.ts file
      fs.writeFileSync(indexPath, updatedExports);
    });
  } else {
    if (extname(indexPath) === "") {
      // It's a directory
      fs.mkdirSync(indexPath, { recursive: true });
      console.log(
        `${indexPath} directory exists or has been created successfully.`,
      );
    } else {
      // If the file or directory doesn't exist, generate default content
      const dynamicImport = `import ${toPascalCase(
        sliceName,
      )}${append} from './${toKebabCase(sliceName)}';\nexport { ${toPascalCase(sliceName)}${append} };`;

      fs.writeFile(indexPath, dynamicImport, { flag: "wx" }, function (err) {
        if (err) throw err;
        console.log("It's saved!");
      });

      console.log(`${indexPath} file exists or has been created successfully.`);
    }

    console.log(`Index file created successfully for '${sliceName}'.`);
  }
};
