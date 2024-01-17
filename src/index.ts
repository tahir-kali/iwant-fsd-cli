#!/usr/bin/env node

import process from "node:process";
import {
  generatePage,
  createEntity,
  createFeatureOrWidget,
} from "./generators";
import { args, sliceName, what } from "./constants";

if (!what) process.exit(1);

if (!sliceName) {
  console.error("Please provide a name for the slice.");
  process.exit(1);
}

if (what === "page") generatePage(sliceName);
else if (what === "entity") createEntity(sliceName, args);
else if (["feature", "widget"].includes(what))
  createFeatureOrWidget(sliceName, what);
