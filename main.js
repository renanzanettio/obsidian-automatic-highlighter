"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => KeywordHighlighterPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/core/studyAnalyzer.ts
var StudyAnalyzer = class {
  analyze(content) {
    const results = [];
    const lines = content.split("\n");
    let offset = 0;
    for (const line of lines) {
      let detectedType = null;
      let start = offset;
      let end = offset + line.length;
      if (line.startsWith("### ")) {
        detectedType = "title";
      } else if (/^\d+\./.test(line.trim())) {
        detectedType = "principle";
      } else if (line.includes(" \xE9 ")) {
        detectedType = "definition";
      } else if (line.includes("visa") || line.includes("serve para") || line.includes("tem como objetivo")) {
        detectedType = "purpose";
      }
      if (detectedType) {
        results.push({
          text: line,
          start,
          end,
          type: detectedType
        });
      }
      const acronymMatch = line.match(/\b[A-Z]{2,}\s*\([^)]+\)/);
      if (acronymMatch) {
        const index = line.indexOf(acronymMatch[0]);
        results.push({
          text: acronymMatch[0],
          start: offset + index,
          end: offset + index + acronymMatch[0].length,
          type: "acronym"
        });
      }
      offset += line.length + 1;
    }
    return results;
  }
};

// src/main.ts
var KeywordHighlighterPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.analyzer = new StudyAnalyzer();
  }
  registerAnalyzeCommand() {
    this.addCommand({
      id: "analyze-note",
      name: "Analyze Note for Important Content",
      callback: async () => {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
          new import_obsidian.Notice("No active file found!");
          return;
        }
        const content = await this.app.vault.read(activeFile);
        const highlights = this.analyzer.analyze(content);
        if (highlights.length === 0) {
          new import_obsidian.Notice("No important content detected.");
          return;
        }
        console.log("Detected highlights:", highlights);
        new import_obsidian.Notice(`Detected ${highlights.length} important sections.`);
      }
    });
  }
  registerNotificationCommand() {
    this.addCommand({
      id: "show-notification",
      name: "Show Notification",
      callback: () => {
        new import_obsidian.Notice("This is a notification from the Keyword Highlighter Plugin!");
      }
    });
  }
  registerReloadCommand() {
    this.addCommand({
      id: "reload-plugin",
      name: "Reload this plugin",
      callback: async () => {
        const id = this.manifest.id;
        await this.app.plugins.disablePlugin(id);
        await this.app.plugins.enablePlugin(id);
        new import_obsidian.Notice("Keyword Highlighter plugin reloaded!");
      }
    });
  }
  async onload() {
    console.log("Loading Keyword Highlighter Plugin");
    this.registerAnalyzeCommand();
    this.registerNotificationCommand();
    this.registerReloadCommand();
  }
  onunload() {
    console.log("Unloading Keyword Highlighter Plugin");
  }
};
//# sourceMappingURL=main.js.map
