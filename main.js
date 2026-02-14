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
var KeywordHighlighterPlugin = class extends import_obsidian.Plugin {
  registerExtractKeywordsCommand() {
    this.addCommand({
      id: "extract-keywords",
      name: "Extract Keywords",
      callback: () => {
        console.log("Extracting keywords from the current note...");
      }
    });
  }
  RegisterNotificationCommand() {
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
    this.registerExtractKeywordsCommand();
    this.RegisterNotificationCommand();
    this.registerReloadCommand();
  }
  onunload() {
    console.log("Unloading Keyword Highlighter Plugin");
  }
};
//# sourceMappingURL=main.js.map
