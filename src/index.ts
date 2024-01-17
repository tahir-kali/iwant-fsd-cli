#!/usr/bin/env node

import process from "node:process";
import {
  generatePage,
  generateEntity,
  generateFeatureOrWidget,
} from "./generators";
import { args, sliceName, what } from "./constants";
import { deleteAll } from "./helpers";

if (!what) process.exit(1);

if (!sliceName) {
  console.error("Please provide a name for the slice.");
  process.exit(1);
}

if (what === "page") generatePage(sliceName);
else if (what === "deleteAll") deleteAll();
else if (what === "entity") generateEntity(sliceName, args);
else if (["feature", "widget"].includes(what))
  generateFeatureOrWidget(sliceName, what);
