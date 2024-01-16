#!/usr/bin/env node

import process from "node:process";
import { generatePage, generateSegments } from "./generators";

const what = process.argv[2];
const sliceName = process.argv[3];
const args = process.argv;
const segments = process.argv.slice(5);

if (!what) process.exit(1);

if (!sliceName) {
  console.error("Please provide a name for the slice.");
  process.exit(1);
}

if (what === "page") {
  generatePage(sliceName);
  if (args.length && args.includes("-s") && segments.length) {
    generateSegments(sliceName, segments);
  }
} else {
  generateSegments(sliceName, [...what], args);
}
