#!/usr/bin/env node

import process from "node:process";
import {
  generatePage,
  generateEntity,
  generateFeatureOrWidget,
  generateShared,
} from "./generators";
import { args, sliceName, what } from "./constants";
import { deleteAll } from "./helpers";

if (!what) process.exit(1);
if (what === "deleteAll") {
  deleteAll();
  console.log("Deleted all src directories!");
  process.exit(1);
}
if (!sliceName) {
  console.error("Please provide a name for the slice.");
  process.exit(1);
}

switch (what) {
  case "page":
    generatePage(sliceName);
    break;
  case "entity":
    generateEntity(sliceName, args);
    break;
  case "feature":
    generateFeatureOrWidget(sliceName, what);
    break;
  case "widget":
    generateFeatureOrWidget(sliceName, what);
    break;
  case "shared":
    generateShared(args);
    break;
}
